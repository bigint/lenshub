import { useApolloClient } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Nft, NftGallery } from 'lens';
import {
  NftGalleriesDocument,
  useDeleteNftGalleryMutation,
  useNftGalleriesLazyQuery,
  useUpdateNftGalleryOrderMutation
} from 'lens';
import type { FC } from 'react';
import React, { Fragment, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import type { Item } from 'src/store/nft-gallery';
import { useNftGalleryStore } from 'src/store/nft-gallery';

import Create from './Create';
import NftCard from './NftCard';
import ReArrange from './ReArrange';

interface Props {
  galleries: NftGallery[];
}

const Gallery: FC<Props> = ({ galleries }) => {
  const [isRearrange, setIsRearrange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const galleryStore = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  const { cache } = useApolloClient();
  const gallery = galleries[0];
  const nfts = gallery.items;

  const [fetchNftGalleries] = useNftGalleriesLazyQuery();
  const [orderGallery] = useUpdateNftGalleryOrderMutation();
  const [deleteNftGallery] = useDeleteNftGalleryMutation({
    onCompleted: () => {
      toast.success(t`Gallery deleted`);
      setGallery({
        name: '',
        items: [],
        toAdd: [],
        toRemove: [],
        isEdit: false,
        id: '',
        alreadySelectedItems: [],
        reArrangedItems: []
      });
    },
    update(cache) {
      const normalizedId = cache.identify({ id: gallery.id, __typename: 'NftGallery' });
      cache.evict({ id: normalizedId });
      cache.gc();
    }
  });

  const onDelete = async () => {
    try {
      if (confirm(t`Are you sure you want to delete?`)) {
        deleteNftGallery({
          variables: {
            request: {
              profileId: currentProfile?.id,
              galleryId: gallery.id
            }
          }
        });
      }
    } catch {}
  };

  const setItemsToGallery = (items: Item[]) => {
    setGallery({
      ...gallery,
      items,
      isEdit: true,
      toAdd: [],
      toRemove: [],
      alreadySelectedItems: items,
      reArrangedItems: []
    });
  };

  const onClickRearrange = () => {
    const items = nfts.map((nft) => {
      return { ...nft, itemId: `${nft.chainId}_${nft.contractAddress}_${nft.tokenId}` };
    });
    setIsRearrange(true);
    setItemsToGallery(items);
  };

  const onClickEditGallery = () => {
    setShowCreateModal(true);
    const items = nfts.map((nft) => {
      return { ...nft, itemId: `${nft.chainId}_${nft.contractAddress}_${nft.tokenId}` };
    });
    setItemsToGallery(items);
  };

  const onSaveRearrange = async () => {
    try {
      await orderGallery({
        variables: {
          request: {
            galleryId: galleryStore.id,
            profileId: currentProfile?.id,
            updates: galleryStore.reArrangedItems
          }
        }
      });
      const { data } = await fetchNftGalleries({
        variables: { request: { profileId: currentProfile?.id } }
      });
      cache.modify({
        fields: {
          nftGalleries() {
            cache.updateQuery({ query: NftGalleriesDocument }, () => ({
              data: data?.nftGalleries as NftGallery[]
            }));
          }
        }
      });
      setIsRearrange(false);
    } catch {}
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h6 className="text-lg font-medium">{isRearrange ? 'Arrange gallery' : gallery.name}</h6>
        {galleryStore?.isEdit && <Create showModal={showCreateModal} setShowModal={setShowCreateModal} />}
        {isRearrange ? (
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsRearrange(false)} size="sm" variant="secondary">
              <Trans>Cancel</Trans>
            </Button>
            <Button onClick={onSaveRearrange} size="sm">
              <Trans>Save</Trans>
            </Button>
          </div>
        ) : currentProfile ? (
          <Menu as="div" className="relative">
            <Menu.Button className="rounded-md p-1 hover:bg-gray-300 hover:bg-opacity-20">
              <DotsVerticalIcon className="h-4 w-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700/80 dark:bg-gray-900"
              >
                <Menu.Item
                  as="label"
                  onClick={onClickEditGallery}
                  className={({ active }) =>
                    clsx(
                      { 'dropdown-active': active },
                      'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
                    )
                  }
                >
                  <Trans>Edit</Trans>
                </Menu.Item>
                <Menu.Item
                  as="label"
                  onClick={onClickRearrange}
                  className={({ active }) =>
                    clsx(
                      { 'dropdown-active': active },
                      'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
                    )
                  }
                >
                  <Trans>Rearrrange</Trans>
                </Menu.Item>
                <Menu.Item
                  as="label"
                  onClick={() => onDelete()}
                  className={({ active }) =>
                    clsx(
                      { 'dropdown-active': active },
                      'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg hover:text-red-500'
                    )
                  }
                >
                  <Trans>Delete</Trans>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : null}
      </div>
      {isRearrange ? (
        <ReArrange />
      ) : (
        <div className="grid gap-5 py-5 md:grid-cols-3">
          {nfts?.map((nft) => (
            <div
              key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
              className="break-inside flex w-full items-center overflow-hidden text-white"
            >
              <NftCard nft={nft as Nft} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Gallery;

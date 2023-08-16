import SingleNft from '@components/Nft/SingleNft';
import NftsShimmer from '@components/Shared/Shimmer/NftsShimmer';
import { CollectionIcon } from '@heroicons/react/outline';
import { IS_MAINNET } from '@lenster/data/constants';
import type { Nft, NfTsRequest, Profile } from '@lenster/lens';
import { useNftFeedQuery } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { CHAIN_ID } from 'src/constants';
import { mainnet } from 'wagmi/chains';

interface NftFeedProps {
  profile: Profile;
  getNftsOnAllChains?: boolean;
  onNftClick?: (nft?: Nft) => void;
  hideDetail?: boolean;
  nftSelected?: Nft;
}

const NftFeed: FC<NftFeedProps> = ({
  profile,
  getNftsOnAllChains,
  onNftClick,
  hideDetail,
  nftSelected
}) => {
  // Variables
  let request: NfTsRequest = getNftsOnAllChains
    ? {
        ownerAddress: profile?.ownedBy,
        limit: 10
      }
    : {
        chainIds: IS_MAINNET ? [CHAIN_ID, mainnet.id] : [CHAIN_ID],
        ownerAddress: profile?.ownedBy,
        limit: 10
      };

  const { data, loading, error, fetchMore } = useNftFeedQuery({
    variables: { request },
    skip: !profile?.ownedBy
  });

  const nfts = data?.nfts?.items;
  const pageInfo = data?.nfts?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return <NftsShimmer />;
  }

  if (nfts?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              @{formatHandle(profile?.handle)}
            </span>
            <span>
              <Trans>doesn’t have any NFTs!</Trans>
            </span>
          </div>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load nft feed`} error={error} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {nfts?.map((nft) => {
        const key = `${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`;
        const selectedNftKey = `${nftSelected?.chainId}_${nftSelected?.contractAddress}_${nftSelected?.tokenId}`;
        return (
          <div onClick={() => onNftClick && onNftClick(nft as Nft)} key={key}>
            <SingleNft
              isSelected={key === selectedNftKey}
              linkToDetail={!hideDetail}
              nft={nft as Nft}
            />
          </div>
        );
      })}
      {hasMore && <span ref={observe} />}
    </div>
  );
};

export default NftFeed;

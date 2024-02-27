import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import getFavicon from '@hey/lib/getFavicon';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Embed from './Embed';
import Nft from './Nft';
import Player from './Player';
import Portal from './Portal';

interface OembedProps {
  className?: string;
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
  publication?: AnyPublication;
  url?: string;
}

const Oembed: FC<OembedProps> = ({
  className = '',
  openActionEmbed,
  openActionEmbedLoading,
  publication,
  url
}) => {
  const { data, error, isLoading } = useQuery({
    enabled: Boolean(url),
    queryFn: async () => {
      const response = await axios.get(`${HEY_API_URL}/oembed`, {
        params: { url }
      });
      return response.data.oembed;
    },
    queryKey: ['oembed', url],
    refetchOnMount: false
  });

  if (isLoading || error || !data) {
    return null;
  }

  const og: OG = {
    description: data?.description,
    favicon: getFavicon(data.url),
    html: data?.html,
    image: data?.image,
    isLarge: data?.isLarge,
    nft: data?.nft,
    portal: data?.portal,
    site: data?.site,
    title: data?.title,
    url: url as string
  };

  if (!og.title && !og.html && !og.nft && !og.portal) {
    return null;
  }

  return (
    <div className={className}>
      {og.html ? (
        <Player og={og} />
      ) : og.nft ? (
        <Nft
          nft={og.nft}
          openActionEmbed={openActionEmbed}
          openActionEmbedLoading={openActionEmbedLoading}
          publication={publication}
        />
      ) : og.portal ? (
        <Portal portal={og.portal} publicationId={publication?.id} />
      ) : (
        <Embed og={og} publicationId={publication?.id} />
      )}
    </div>
  );
};

export default Oembed;

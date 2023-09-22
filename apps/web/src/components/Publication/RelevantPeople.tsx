import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Regex } from '@lenster/data/regex';
import { FollowUnfollowSource } from '@lenster/data/tracking';
import type { AnyPublication, Profile } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import { Card, ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';

interface RelevantPeopleProps {
  publication: AnyPublication;
}

const RelevantPeople: FC<RelevantPeopleProps> = ({ publication }) => {
  const targetPubliction = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const mentions =
    targetPubliction?.metadata?.marketplace?.description?.match(
      Regex.mention,
      '$1[~$2]'
    ) ?? [];

  const processedMentions = mentions.map((mention: string) => {
    const trimmedMention = mention.trim().replace('@', '').replace("'s", '');

    if (trimmedMention.length > 9) {
      return mention.trim().replace("'s", '').replace(Regex.santiizeHandle, '');
    }

    return formatHandle(publication?.by?.handle);
  });

  const cleanedMentions = processedMentions.reduce(
    (handles: string[], handle: string) => {
      if (!handles.includes(handle)) {
        handles.push(handle);
      }

      return handles;
    },
    []
  );

  const { data, loading, error } = useProfilesQuery({
    variables: { request: { where: { handles: cleanedMentions.slice(0, 5) } } },
    skip: mentions.length <= 0
  });

  if (mentions.length <= 0) {
    return null;
  }

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
        <UserProfileShimmer showFollow />
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  return (
    <Card as="aside" className="space-y-4 p-5" dataTestId="relevant-profiles">
      <ErrorMessage title={t`Failed to load relevant people`} error={error} />
      {data?.profiles?.items?.map((profile, index) => (
        <div key={profile?.id} className="truncate">
          <UserProfile
            profile={profile as Profile}
            isFollowing={profile.operations.isFollowedByMe.value}
            followUnfollowPosition={index + 1}
            followUnfollowSource={
              FollowUnfollowSource.PUBLICATION_RELEVANT_PROFILES
            }
            showUserPreview={false}
            showFollow
          />
        </div>
      ))}
    </Card>
  );
};

export default RelevantPeople;

import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import type { AnyPublication, FeedHighlightsRequest } from '@hey/lens';
import { LimitType, useFeedHighlightsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { OptmisticPublicationType } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useTimelineStore } from 'src/store/timeline';
import { useTransactionPersistStore } from 'src/store/transaction';

const Highlights: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const seeThroughProfile = useTimelineStore(
    (state) => state.seeThroughProfile
  );

  // Variables
  const request: FeedHighlightsRequest = {
    where: { for: seeThroughProfile?.id ?? currentProfile?.id },
    limit: LimitType.Fifty
  };

  const { data, loading, error, fetchMore } = useFeedHighlightsQuery({
    variables: { request }
  });

  const publications = data?.feedHighlights?.items;
  const pageInfo = data?.feedHighlights?.pageInfo;
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
    return <PublicationsShimmer />;
  }

  if (publications?.length === 0) {
    return (
      <EmptyState
        message="No posts yet!"
        icon={<LightBulbIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load highlights" error={error} />;
  }

  return (
    <Card className="divide-y-[1px] dark:divide-gray-700">
      {txnQueue.map((txn) =>
        txn?.type === OptmisticPublicationType.NewPost ? (
          <div key={txn.id}>
            <QueuedPublication txn={txn} />
          </div>
        ) : null
      )}
      {publications?.map((publication, index) => (
        <SinglePublication
          key={`${publication?.id}_${index}`}
          isFirst={index === 0}
          isLast={index === publications.length - 1}
          publication={publication as AnyPublication}
        />
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </Card>
  );
};

export default Highlights;

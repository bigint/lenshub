import SinglePost from "@components/Post/SinglePost";
import PostsShimmer from "@components/Shared/Shimmer/PostsShimmer";
import { FlagIcon } from "@heroicons/react/24/outline";
import type { AnyPost } from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import ReportDetails from "./ReportDetails";

const ReportsFeed: FC = () => {
  const request: ModReportsRequest = { limit: LimitType.Fifty };

  const { data, error, fetchMore, loading } = useModLatestReportsQuery({
    variables: { request }
  });

  const reports = data?.modLatestReports?.items;
  const pageInfo = data?.modLatestReports?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <PostsShimmer />;
  }

  if (reports?.length === 0) {
    return (
      <EmptyState
        icon={<FlagIcon className="size-8" />}
        message="No reports yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load reports feed" />;
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-5"
      components={{ Footer: () => <div className="pb-5" /> }}
      computeItemKey={(index, report) =>
        `${report.reporter.id}-${report.reportedPublication?.id}-${index}`
      }
      data={reports}
      endReached={onEndReached}
      itemContent={(_, report) => {
        // TODO: Fix this when Lens team gives us the correct solution
        if (!report.reportedPublication) {
          return null;
        }

        return (
          <Card>
            <SinglePost
              isFirst
              post={report.reportedPublication as AnyPost}
              showActions={false}
              showThread={false}
            />
            <div className="divider" />
            <ReportDetails report={report as ModReport} />
          </Card>
        );
      }}
      useWindowScroll
    />
  );
};

export default ReportsFeed;

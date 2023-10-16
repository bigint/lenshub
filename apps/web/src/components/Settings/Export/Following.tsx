import { SETTINGS } from '@hey/data/tracking';
import type { FollowingRequest } from '@hey/lens';
import { LimitType, useFollowingLazyQuery } from '@hey/lens';
import { Button, Card } from '@hey/ui';
import downloadJson from '@lib/downloadJson';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';

const Following: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [following, setFollowing] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: FollowingRequest = {
    for: currentProfile?.id,
    limit: LimitType.Fifty
  };

  const [exportFollowing] = useFollowingLazyQuery({
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    Leafwatch.track(SETTINGS.EXPORT.FOLLOWING);
    setExporting(true);
    const fetchFollowing = async (cursor?: string) => {
      const { data } = await exportFollowing({
        variables: { request: { ...request, cursor } },
        onCompleted: (data) => {
          setFollowing((prev) => {
            const newFollowing = data.following.items.filter((newFollowing) => {
              return !prev.some(
                (following) => following.id === newFollowing.id
              );
            });

            return [...prev, ...newFollowing];
          });
        }
      });

      if (
        data?.following.items.length === 0 ||
        !data?.following.pageInfo.next
      ) {
        setFetchCompleted(true);
        setExporting(false);
      } else {
        await fetchFollowing(data?.following.pageInfo.next);
      }
    };

    await fetchFollowing();
  };

  const download = () => {
    downloadJson(following, 'following', () => {
      setFollowing([]);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">Export following</div>
      <div className="pb-2">Export all your following to a JSON file.</div>
      {following.length > 0 ? (
        <div className="pb-2">
          Exported <b>{following.length}</b> following
        </div>
      ) : null}
      {fetchCompleted ? (
        <Button onClick={download}>Download following</Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export now'}
        </Button>
      )}
    </Card>
  );
};

export default Following;

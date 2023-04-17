import downloadJson from '@lib/downloadJson';
import { Trans } from '@lingui/macro';
import type { SingleProfileQueryRequest } from 'lens';
import { Profile, useProfileLazyQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Button, Card } from 'ui';

const Profile: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [exporting, setExporting] = useState(false);
  const [fetchCompleted, setFetchCompleted] = useState(false);

  const request: SingleProfileQueryRequest = {
    profileId: currentProfile?.id
  };

  const [exportProfile] = useProfileLazyQuery({
    variables: { request },
    fetchPolicy: 'network-only'
  });

  const handleExportClick = async () => {
    setExporting(true);
    exportProfile({
      onCompleted: ({ profile }) => {
        setProfile(profile as Profile);
        setFetchCompleted(true);
        setExporting(false);
      }
    });
  };

  const download = () => {
    downloadJson(profile, 'profile', () => {
      setProfile(null);
      setFetchCompleted(false);
    });
  };

  return (
    <Card className="space-y-2 p-5">
      <div className="text-lg font-bold">
        <Trans>Export profile</Trans>
      </div>
      <div className="pb-2">
        <Trans>Export all your profile data to a JSON file.</Trans>
      </div>
      {fetchCompleted ? (
        <Button onClick={download}>
          <Trans>Download profile</Trans>
        </Button>
      ) : (
        <Button onClick={handleExportClick} disabled={exporting}>
          {exporting ? <Trans>Exporting...</Trans> : <Trans>Export now</Trans>}
        </Button>
      )}
    </Card>
  );
};

export default Profile;

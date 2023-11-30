import Loader from '@components/Shared/Loader';
import type { InvitedResult } from '@hey/lens';
import { useInvitedProfilesQuery } from '@hey/lens';
import { ErrorMessage } from '@hey/ui';
import useProfileStore from '@persisted/useProfileStore';
import type { FC } from 'react';

import Invite from './Invite';
import Invited from './Invited';

const Invites: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { data, loading, error, refetch } = useInvitedProfilesQuery();

  if (loading) {
    return <Loader message="Loading invites" />;
  }

  if (error) {
    return <ErrorMessage title="Failed to load invites" error={error} />;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto p-5">
      <Invite
        invitesLeft={currentProfile?.invitesLeft ?? 0}
        refetch={refetch}
      />
      <div className="divider my-5" />
      <Invited invitedProfiles={data?.invitedProfiles as InvitedResult[]} />
    </div>
  );
};

export default Invites;

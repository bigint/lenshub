import { heyFont } from "@helpers/fonts";
import { FeatureFlag } from "@hey/data/feature-flags";
import type { Profile } from "@hey/lens";
import { Card } from "@hey/ui";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import CreatorTool from "./CreatorTool";
import StaffTool from "./StaffTool";

interface InternalToolsProps {
  profile: Profile;
}

const InternalTools: FC<InternalToolsProps> = ({ profile }) => {
  const hasCreatorToolAccess = useFlag(FeatureFlag.CreatorTools);
  const isStaff = useFlag(FeatureFlag.Staff);

  if (!hasCreatorToolAccess || !isStaff) {
    return null;
  }

  return (
    <Card
      as="aside"
      className={cn(
        "!bg-yellow-300/20 mb-4 space-y-5 border-yellow-400 p-5 text-yellow-600",
        heyFont.className
      )}
      forceRounded
    >
      {hasCreatorToolAccess && <CreatorTool profile={profile} />}
      {isStaff && <StaffTool profile={profile} />}
    </Card>
  );
};

export default InternalTools;

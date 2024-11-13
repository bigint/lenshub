import PostWrapper from "@components/Shared/PostWrapper";
import type { AnyPublication } from "@hey/lens";
import type { FC } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";
import PostActions from "./Actions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface ThreadBodyProps {
  publication: AnyPublication;
}

const ThreadBody: FC<ThreadBodyProps> = ({ publication }) => {
  usePushToImpressions(publication.id);

  return (
    <PostWrapper publication={publication}>
      <div className="relative flex items-start space-x-3 pb-3">
        <PostAvatar publication={publication} />
        <div className="absolute bottom-0 left-[9.1px] h-full border-[0.9px] border-gray-300 border-solid dark:border-gray-700" />
        <div className="w-[calc(100%-55px)]">
          <PostHeader publication={publication} />
          {publication.isHidden ? (
            <HiddenPost type={publication.__typename} />
          ) : (
            <>
              <PostBody post={publication} />
              <PostActions post={publication} />
            </>
          )}
        </div>
      </div>
    </PostWrapper>
  );
};

export default ThreadBody;

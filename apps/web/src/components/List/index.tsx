import MetaTags from "@components/Common/MetaTags";
import { Leafwatch } from "@helpers/leafwatch";
import { APP_NAME } from "@hey/data/constants";
import { PAGEVIEW } from "@hey/data/tracking";
import getList from "@hey/helpers/api/lists/getList";
import { GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import Details from "./Details";
import Profiles from "./Profiles";
import ListPageShimmer from "./Shimmer";

const ViewList: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { id }
  } = useRouter();
  const showProfiles = pathname === "/lists/[id]/profiles";

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: "list",
        subpage: pathname.replace("/lists/[id]", "")
      });
    }
  }, [id]);

  const {
    data: list,
    error,
    isLoading: listLoading
  } = useQuery({
    enabled: Boolean(id),
    queryFn: () => getList(id as string),
    queryKey: ["getList", id]
  });

  if (!isReady || listLoading) {
    return <ListPageShimmer profileList={showProfiles} />;
  }

  if (!list) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <MetaTags
        description={list.description || ""}
        title={`${list.name} • ${APP_NAME}`}
      />
      <GridLayout>
        <GridItemFour>
          <Details list={list} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {showProfiles ? (
            <Profiles listId={list.id} name={list.name} />
          ) : (
            <div>Feed</div>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewList;

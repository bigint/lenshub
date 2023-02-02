import { AVATAR, ZERO_ADDRESS } from 'data/constants';

import getIPFSLink from './getIPFSLink';
import getStampFyiURL from './getStampFyiURL';
import imageProxy from './imageProxy';

const skipList = ['cdn.stamp.fyi', 'avataaars.io'];

/**
 *
 * @param profile - Profile object
 * @param isCdn - To passthrough image proxy
 * @returns avatar image url
 */
const getAvatar = (profile: any, isCdn = true): string => {
  if (isCdn) {
    const avatarUrl =
      profile?.picture?.original?.url ??
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);
    const url = new URL(avatarUrl);

    if (skipList.includes(url.hostname)) {
      return avatarUrl;
    }

    return imageProxy(getIPFSLink(avatarUrl), AVATAR);
  }

  return getIPFSLink(
    profile?.picture?.original?.url ??
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  );
};

export default getAvatar;

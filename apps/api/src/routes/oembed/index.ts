import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import sha256 from '@hey/helpers/sha256';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_1_DAY } from 'src/helpers/constants';
import getMetadata from 'src/helpers/oembed/getMetadata';
import { getRedis, setRedis } from 'src/helpers/redisClient';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return noBody(res);
  }

  try {
    const cacheKey = `oembed:${sha256(url as string).slice(0, 10)}`;
    const cachedData = await getRedis(cacheKey);

    if (cachedData) {
      logger.info(`(cached) Oembed generated for ${url}`);
      return res
        .status(200)
        .setHeader('Cache-Control', CACHE_AGE_1_DAY)
        .json({ result: JSON.parse(cachedData), success: true });
    }

    const oembed = await getMetadata(url as string);

    if (!oembed) {
      return res.status(200).json({ oembed: null, success: false });
    }

    const skipCache = oembed.frame !== null;

    if (!skipCache) {
      await setRedis(cacheKey, oembed);
    }

    logger.info(`Oembed generated for ${url}`);

    return res
      .status(200)
      .setHeader('Cache-Control', skipCache ? 'no-cache' : CACHE_AGE_1_DAY)
      .json({ oembed, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};

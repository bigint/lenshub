import type { Handler } from 'express';
import type { Address } from 'viem';

import { HEY_MEMBERSHIP_NFT_PUBLICATION_ID } from '@hey/data/constants';
import logger from '@hey/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_INDEFINITE } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import { getAddress } from 'viem';

export const get: Handler = async (req, res) => {
  const { address, id } = req.query;

  if (!id && !address) {
    return noBody(res);
  }

  try {
    const formattedAddress = address
      ? getAddress(address as Address)
      : undefined;
    const data = await lensPg.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM profile.record p
          JOIN publication.open_action_module_acted_record o ON p.profile_id = o.acted_profile_id
          WHERE
            (p.profile_id = $1 OR p.owned_by = $2)
            AND o.publication_id = $3
        ) AS result;
      `,
      [id, formattedAddress, HEY_MEMBERSHIP_NFT_PUBLICATION_ID]
    );

    const hasHeyNft = data[0]?.result;

    logger.info(`Hey NFT badge fetched for ${id || formattedAddress}`);

    return res
      .status(200)
      .setHeader('Cache-Control', hasHeyNft ? CACHE_AGE_INDEFINITE : 'no-cache')
      .json({ hasHeyNft, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};

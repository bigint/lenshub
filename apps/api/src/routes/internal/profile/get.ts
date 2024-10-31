import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { InternalProfile, ProfileTheme } from "@hey/types/hey";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateHasCreatorToolsAccess from "src/helpers/middlewares/validateHasCreatorToolsAccess";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  validateLensAccount,
  validateHasCreatorToolsAccess,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const [preference, permissions, email, membershipNft, theme, mutedWords] =
        await prisma.$transaction([
          prisma.preference.findUnique({ where: { id: id as string } }),
          prisma.profilePermission.findMany({
            include: { permission: { select: { key: true } } },
            where: { enabled: true, profileId: id as string }
          }),
          prisma.email.findUnique({ where: { id: id as string } }),
          prisma.membershipNft.findUnique({ where: { id: id as string } }),
          prisma.profileTheme.findUnique({ where: { id: id as string } }),
          prisma.mutedWord.findMany({ where: { profileId: id as string } })
        ]);

      const response: InternalProfile = {
        appIcon: preference?.appIcon || 0,
        email: email?.email || null,
        emailVerified: Boolean(email?.verified),
        hasDismissedOrMintedMembershipNft: Boolean(
          membershipNft?.dismissedOrMinted
        ),
        highSignalNotificationFilter: Boolean(
          preference?.highSignalNotificationFilter
        ),
        developerMode: Boolean(preference?.developerMode),
        theme: (theme as ProfileTheme) || null,
        permissions: permissions.map(({ permission }) => permission.key),
        mutedWords: mutedWords.map(({ id, word, expiresAt }) => ({
          id,
          word,
          expiresAt
        }))
      };

      logger.info(`Internal profile fetched for ${id}`);

      return res.status(200).json({ result: response, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];

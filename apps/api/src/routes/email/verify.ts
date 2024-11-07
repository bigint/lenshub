import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { noBody } from "src/helpers/responses";
import csrfProtection from "src/helpers/middlewares/csrf";

export const get = [
  csrfProtection,
  async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
      return noBody(res);
    }

    try {
      const updatedEmail = await prisma.email.update({
        data: { tokenExpiresAt: null, verificationToken: null, verified: true },
        where: { verificationToken: token as string }
      });

      await delRedis(`preference:${updatedEmail.id}`);
      logger.info(`Email verified for ${updatedEmail.email}`);

      return res.redirect("https://hey.xyz");
    } catch (error) {
      return catchedError(res, error);
    }
  }
];

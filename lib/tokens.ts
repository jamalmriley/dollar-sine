import crypto from "crypto";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { get2FATokenByEmail } from "@/data/two-factor-token";

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires_at = new Date(new Date().getTime() + 6000 * 30); // 30 minutes

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires_at,
    },
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires_at = new Date(new Date().getTime() + 6000 * 30); // 30 minutes

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires_at,
    },
  });

  return verificationToken;
};

export const generate2FAToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires_at = new Date(new Date().getTime() + 6000 * 10); // 10 minutes
  const existingToken = await get2FATokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires_at,
    },
  });

  return twoFactorToken;
};

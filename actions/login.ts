"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { send2FAEmail, sendVerificationEmail } from "@/lib/mail";
import { generate2FAToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { get2FATokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { get2FAConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password" };
  }
  const { email, password, _2FACode } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email not found" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification email sent" };
  }

  if (existingUser.is2FAEnabled && existingUser.email) {
    if (_2FACode) {
      const twoFactorToken = await get2FATokenByEmail(existingUser.email);

      if (!twoFactorToken) return { error: "Invalid one-time passcode" };
      if (twoFactorToken.token !== _2FACode)
        return { error: "Invalid one-time passcode" };

      const hasExpiredToken = new Date(twoFactorToken.expires_at) < new Date();

      if (hasExpiredToken)
        return { error: "Code expired. Please request a new one." };

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await get2FAConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {userId: existingUser.id}
      })
    } else {
      const twoFactorToken = await generate2FAToken(existingUser.email);
      await send2FAEmail(twoFactorToken.email, twoFactorToken.token);

      return { _2FA: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }

    throw error;
  }
};

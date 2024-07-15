import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const passwordResetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p><a href="${passwordResetLink}">Click here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "hello@dollarsine.org",
    to: email,
    subject: "Please confirm your email",
    html: `<p><a href="${confirmationLink}">Click here</a> to confirm your email.</p>`,
  });
};

export const send2FAEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "hello@dollarsine.org",
    to: email,
    subject: `${token} is your verification code`,
    html: `<p>Hi there,</p><br/><p>${token} is your verification code. This code expires in 10 minutes or if a new code is requested, whichever comes first.</p>`,
  });
};

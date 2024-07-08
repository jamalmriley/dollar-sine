import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const PasswordResetSchema = z.object({
  email: z.string().email({
    message: "An email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "An email is required",
  }),
  password: z.string().min(1, {
    message: "A password is required",
  }),
  _2FACode: z.optional(z.string()),
});

export const SignUpSchema = z.object({
  email: z.string().email({
    message: "An email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

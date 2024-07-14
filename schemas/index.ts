import { UserRole } from "@prisma/client";
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

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    is2FAEnabled: z.optional(z.boolean()),
    role: z.enum([
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.TEACHER,
      UserRole.PARENT,
      UserRole.STUDENT,
    ]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) return false;
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) return false;
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "An email is required",
  }),
  password: z.string().min(1, {
    message: "A password is required",
  }),
});

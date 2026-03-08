import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine((value) => emailRegex.test(value), {
      message: 'Email must be with "@" sign and domain name',
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(5, "Name must be at least 5 characters"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(5, "Username must be at least 5 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .refine((value) => emailRegex.test(value), {
        message: 'Email must be with "@" sign and domain name',
      }),
    phone: z
      .string()
      .min(1, "Number phone is required")
      .min(10, "Number phone must be at least 10 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

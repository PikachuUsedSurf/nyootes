import { z } from 'zod';

// Note validation
export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required'),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type NoteFormData = z.infer<typeof noteSchema>;

// User validation
export const userRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
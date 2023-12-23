import { z } from 'zod';
import { USER_STATUS } from './user.constant';

const UserValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    password: z
      .string({
        invalid_type_error: 'Password must be a string.',
      })
      .max(20, { message: 'password can not be more than 20 characters' })
      .optional(),
  }),
});

const UserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...USER_STATUS] as [string, ...string[]]),
  }),
});

export const userValidations = {
  UserValidationSchema,
  UserStatusValidationSchema,
};

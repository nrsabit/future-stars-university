import { z } from 'zod';

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

export const userValidations = {
  UserValidationSchema,
};

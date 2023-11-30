import { z } from 'zod';

const CreateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

const UpdateAcademicFacultyValidationSchema = z.object({
    body: z.object({
      name: z.string().optional(),
    }),
  });

export const AcademicFacultyValidations = {
    CreateAcademicFacultyValidationSchema,
    UpdateAcademicFacultyValidationSchema
};

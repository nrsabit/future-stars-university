import { z } from 'zod';

const CreateAcademicDepartmentValitionSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is Required',
      invalid_type_error: 'Invalid name type',
    }),
    academicFaculty: z.string({
      required_error: 'Academic faculty is Required',
      invalid_type_error: 'Invalid Faculty',
    }),
  }),
});

const UpdateAcademicDepartmentValitionSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is Required',
        invalid_type_error: 'Invalid name type',
      })
      .optional(),
    academicFaculty: z
      .string({
        required_error: 'Academic faculty is Required',
        invalid_type_error: 'Invalid Faculty',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  CreateAcademicDepartmentValitionSchema,
  UpdateAcademicDepartmentValitionSchema,
};

import { z } from 'zod';
import { Days } from './offeredCourse.constant';

// refine function to check the start and end time format, used regex here, 
const timeStringValidationSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const testedTime = regex.test(time);
    return testedTime;
  },
  { message: 'Invalid time format, expected "HH:MM"' },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringValidationSchema,
      endTime: timeStringValidationSchema,
    })
    //checking the end time is bigger than start time or not. 
    .refine(
      (body) => {
        const startTime = new Date(`1999-01-01T${body?.startTime}:00`);
        const endTime = new Date(`1999-01-01T${body?.endTime}:00`);
        return endTime > startTime;
      },
      { message: 'End time should be after start time' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};

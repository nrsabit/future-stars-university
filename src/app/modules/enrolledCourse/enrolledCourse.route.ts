import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth(USER_ROLES.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.CreateEnrolledCourseController,
);

router.get(
  '/',
  auth(USER_ROLES.faculty),
  EnrolledCourseControllers.getAllEnrolledCoursesController,
);

router.get(
  '/my-enrolled-courses',
  auth(USER_ROLES.student),
  EnrolledCourseControllers.getMyEnrolledCoursesController,
);

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrolledCourseControllers.UpdateEnrolledCourseController,
);

export const EnrolledCourseRoutes = router;

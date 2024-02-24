import express from 'express';
import { OfferedCourseController } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  OfferedCourseController.GetAllOfferedCoursesController,
);

router.get(
  '/my-offered-courses',
  auth(USER_ROLES.student),
  OfferedCourseController.GetMyOfferedCoursesController,
);

router.get(
  '/:id',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  OfferedCourseController.GetSingleOfferedCourseController,
);

router.post(
  '/create-offered-course',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.CreateOfferedCourseController,
);

router.patch(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseController.UpdateSingleOfferedCourseController,
);

router.delete(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  OfferedCourseController.DeleteOfferedCourseController,
);

export const OfferedCourseRoutes = router;

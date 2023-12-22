import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLES.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.CreateStudentController,
);
router.post(
  '/create-faculty',
  auth(USER_ROLES.admin),
  validateRequest(createFacultyValidationSchema),
  UserControllers.CreateFacultyController,
);

router.post(
  '/create-admin',
  auth(USER_ROLES.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.CreateAdminController,
);

export const UserRoutes = router;

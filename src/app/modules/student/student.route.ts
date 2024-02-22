import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  StudentControllers.GetAllStudentsController,
);
router.get(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  StudentControllers.GetSingleStudentController,
);
router.patch(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.UpdateSingleStudentController,
);
router.patch(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  StudentControllers.DeleteSingleStudentController,
);

export const StudentRoutes = router;

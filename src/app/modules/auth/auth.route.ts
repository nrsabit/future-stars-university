import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { Authcontrollers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  Authcontrollers.LoginUserController,
);

router.post(
  '/change-password',
  auth(USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  Authcontrollers.ChangePasswordController,
);

export const AuthRoutes = router;

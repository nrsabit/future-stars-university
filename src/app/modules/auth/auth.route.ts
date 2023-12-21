import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { Authcontrollers } from './auth.controller';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  Authcontrollers.LoginUserController,
);

export const AuthRoutes = router;

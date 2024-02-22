import { Router } from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  SemesterRegistrationControllers.getAllSemesterRegistrationsController,
);
router.get(
  '/:id',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  SemesterRegistrationControllers.getSingleSemesterRegistrationController,
);
router.post(
  '/create-semester-registration',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistrationController,
);
router.patch(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistrationController,
);
router.delete(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  SemesterRegistrationControllers.deleteSemesterRegistrationController,
);

export const SemesterRegistrationRoutes = router;

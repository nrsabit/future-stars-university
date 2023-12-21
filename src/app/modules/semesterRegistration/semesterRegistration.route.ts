import { Router } from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get(
  '/',
  SemesterRegistrationControllers.getAllSemesterRegistrationsController,
);
router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistrationController,
);
router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistrationController,
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistrationController,
);
router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSemesterRegistrationController,
);

export const SemesterRegistrationRoutes = router;

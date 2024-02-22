import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemisterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();
router.post(
  '/create-academic-semester',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(
    AcademicSemisterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.CreateAcademicSemesterController,
);

router.get(
  '/',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  AcademicSemesterControllers.GetAllAcademicSemesterController,
);

router.get(
  '/:semesterId',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  AcademicSemesterControllers.GetSingleAcademicSemesterController,
);

router.patch(
  '/:semesterId',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(
    AcademicSemisterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.UpdateSingleAcademicSemesterController,
);

export const AcademicSemesterRoute = router;

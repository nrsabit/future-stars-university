import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemisterValidations } from './academicSemester.validation';
import { AcademicSemesterControllers } from './academicSemester.controller';

const router = Router();
router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemisterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.CreateAcademicSemesterController,
);

router.get('/', AcademicSemesterControllers.GetAllAcademicSemesterController);

router.get(
  '/:semesterId',
  AcademicSemesterControllers.GetSingleAcademicSemesterController,
);

router.patch(
  '/:semesterId',
  validateRequest(
    AcademicSemisterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.UpdateSingleAcademicSemesterController,
);

export const AcademicSemesterRoute = router;

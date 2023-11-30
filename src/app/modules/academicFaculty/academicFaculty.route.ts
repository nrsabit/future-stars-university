import { Router } from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidations } from './academicFaculty.validation';

const router = Router();

router.get('/', AcademicFacultyControllers.GetAllAcademicFacultiesController);
router.get(
  '/:facultyId',
  AcademicFacultyControllers.GetSingleAcademicFacultyController,
);
router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidations.CreateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.CreateAcademicFacultyController,
);
router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidations.UpdateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.UpdateSingleAcademicFacultyController,
);

export const AcademicFacultyRoutes = router;

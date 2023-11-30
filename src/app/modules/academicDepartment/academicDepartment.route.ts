import { Router } from 'express';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get(
  '/',
  AcademicDepartmentControllers.GetAllAcademicDepartmentsController,
);
router.get(
  '/:departmentId',
  AcademicDepartmentControllers.GetSingleAcademicDepartmentsController,
);
router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidations.CreateAcademicDepartmentValitionSchema,
  ),
  AcademicDepartmentControllers.CreateSingleAcademicDepartmentsController,
);
router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.UpdateAcademicDepartmentValitionSchema,
  ),
  AcademicDepartmentControllers.UpdateSingleAcademicDepartmentsController,
);

export const AcademicDepartmentRoute = router;

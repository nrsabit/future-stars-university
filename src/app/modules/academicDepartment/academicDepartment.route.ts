import { Router } from 'express';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

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
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
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

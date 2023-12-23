import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  auth('admin', 'faculty'),
  StudentControllers.GetAllStudentsController,
);
router.get(
  '/:id',
  auth('admin', 'faculty'),
  StudentControllers.GetSingleStudentController,
);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.UpdateSingleStudentController,
);
router.patch('/:id', StudentControllers.DeleteSingleStudentController);

export const StudentRoutes = router;

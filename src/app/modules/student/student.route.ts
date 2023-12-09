import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

router.get('/', StudentControllers.GetAllStudentsController);
router.get('/:id', StudentControllers.GetSingleStudentController);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.UpdateSingleStudentController,
);
router.patch('/:id', StudentControllers.DeleteSingleStudentController);

export const StudentRoutes = router;

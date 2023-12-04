import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

router.get('/', StudentControllers.GetAllStudentsController);
router.get('/:studentId', StudentControllers.GetSingleStudentController);
router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.UpdateSingleStudentController,
);
router.patch('/:studentId', StudentControllers.DeleteSingleStudentController);

export const StudentRoutes = router;

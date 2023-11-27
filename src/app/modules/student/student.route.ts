import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.GetAllStudentsController);
router.get('/:studentId', StudentControllers.GetSingleStudentController);
router.delete('/:studentId', StudentControllers.DeleteSingleStudentController);

export const StudentRoutes = router;

import express from 'express';
import { OfferedCourseController } from './offeredCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = express.Router();

router.get('/', OfferedCourseController.GetAllOfferedCoursesController);

router.get('/:id', OfferedCourseController.GetSingleOfferedCourseController);

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseController.CreateOfferedCourseController,
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseController.UpdateSingleOfferedCourseController,
);

export const OfferedCourseRoutes = router;

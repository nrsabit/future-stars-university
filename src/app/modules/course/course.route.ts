import { Router } from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';

const router = Router();

router.get('/', CourseControllers.getAllCoursesController);
router.get('/:id', CourseControllers.getSingleCourseController);
router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourseController,
);
router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateSingleCourseController,
);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFucultiesWithCourseController,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFucultiesWithCourseController,
);
router.delete('/:id', CourseControllers.deleteCourseController);

export const CourseRoutes = router;

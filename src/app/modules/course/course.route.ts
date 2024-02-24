import { Router } from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  CourseControllers.getAllCoursesController,
);
router.get('/:id', CourseControllers.getSingleCourseController);
router.post(
  '/create-course',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourseController,
);
router.patch(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.faculty),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateSingleCourseController,
);
router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFucultiesWithCourseController,
);
router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    USER_ROLES.faculty,
    USER_ROLES.student,
  ),
  CourseControllers.getCourseFacultyController,
);
router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFucultiesWithCourseController,
);
router.delete(
  '/:id',
  auth(USER_ROLES.superAdmin, USER_ROLES.admin),
  CourseControllers.deleteCourseController,
);

export const CourseRoutes = router;

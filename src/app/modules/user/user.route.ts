import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from '../student/student.validation';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLES.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.CreateStudentController,
);
router.post(
  '/create-faculty',
  auth(USER_ROLES.admin),
  validateRequest(createFacultyValidationSchema),
  UserControllers.CreateFacultyController,
);

router.post(
  '/create-admin',
  auth(USER_ROLES.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.CreateAdminController,
);

router.get(
  '/me',
  auth(USER_ROLES.admin, USER_ROLES.faculty, USER_ROLES.student),
  UserControllers.GetMeController,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLES.admin),
  UserControllers.ChangeUserStatusController,
);

export const UserRoutes = router;

import { UserServices } from './user.service';
import responseHandler from '../../utils/responseHandler';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const CreateStudentController = catchAsync(async (req, res) => {
  const { student: studentData, password } = req.body;
  const result = await UserServices.CreateStudentService(req.file, studentData, password);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Created Successfully',
    data: result,
  });
});

const CreateFacultyController = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.CreateFacultyService(req.file, password, facultyData);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const CreateAdminController = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.CreateAdminService(req.file, password, adminData);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

const GetMeController = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  const result = await UserServices.getMeService(userId, role);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

const ChangeUserStatusController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.changeUserStatusService(id, req.body);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Status Changed Successfully',
    data: result,
  });
});

export const UserControllers = {
  CreateStudentController,
  CreateFacultyController,
  CreateAdminController,
  GetMeController,
  ChangeUserStatusController,
};

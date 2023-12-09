import { UserServices } from './user.service';
import responseHandler from '../../utils/responseHandler';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const CreateStudentController = catchAsync(async (req, res) => {
  const { student: studentData, password } = req.body;
  //   const zodParsedData = studentValidationSchema.parse(studentData);
  const result = await UserServices.CreateStudentService(studentData, password);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Created Successfully',
    data: result,
  });
});

const CreateFacultyController = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.CreateFacultyService(password, facultyData);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created succesfully',
    data: result,
  });
});

const CreateAdminController = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.CreateAdminService(password, adminData);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

export const UserControllers = {
  CreateStudentController,
  CreateFacultyController,
  CreateAdminController,
};

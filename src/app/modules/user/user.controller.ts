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

export const UserControllers = {
  CreateStudentController,
};

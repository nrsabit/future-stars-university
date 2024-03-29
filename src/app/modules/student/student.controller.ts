import { StudentServices } from './student.service';
import httpStatus from 'http-status';
import responseHandler from '../../utils/responseHandler';
import catchAsync from '../../utils/catchAsync';

// the controllers for student.

const GetAllStudentsController = catchAsync(async (req, res) => {
  const result = await StudentServices.GetAllStudentsService(req.query);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrived Successfully',
    meta: result.meta,
    data: result.result,
  });
});

const GetSingleStudentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.GetSingleStudentService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrived Successfully',
    data: result,
  });
});

const UpdateSingleStudentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.UpdateStudentService(id, student);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is Updated Successfully',
    data: result,
  });
});

const DeleteSingleStudentController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentServices.DeleteStudentService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is deleted Successfully',
    data: result,
  });
});

export const StudentControllers = {
  GetAllStudentsController,
  GetSingleStudentController,
  UpdateSingleStudentController,
  DeleteSingleStudentController,
};

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { OfferedCourseServices } from './offeredCourse.service';

const CreateOfferedCourseController = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseService(
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is Created Successfully',
    data: result,
  });
});

const GetAllOfferedCoursesController = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesService(
    req.query,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses are retrieved Successfully',
    data: result,
  });
});

const GetMyOfferedCoursesController = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await OfferedCourseServices.getMyOfferedCoursesService(userId, req.query);
  
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Offered Courses are retrieved Successfully',
    data: result,
  });
});

const GetSingleOfferedCourseController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is retrieved Successfully',
    data: result,
  });
});

const UpdateSingleOfferedCourseController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseService(
    id,
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is Updated Successfully',
    data: result,
  });
});

const DeleteOfferedCourseController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is Deleted Successfully',
    data: result,
  });
});

export const OfferedCourseController = {
  CreateOfferedCourseController,
  GetAllOfferedCoursesController,
  GetMyOfferedCoursesController,
  GetSingleOfferedCourseController,
  UpdateSingleOfferedCourseController,
  DeleteOfferedCourseController,
};

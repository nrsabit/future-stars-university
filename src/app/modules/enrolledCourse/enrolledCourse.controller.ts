import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { EnrolledCourseServices } from './enrolledCourse.service';

const CreateEnrolledCourseController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await EnrolledCourseServices.CreateEnrolledCourseService(
    userId,
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Successfully Enrolled to the Course',
    data: result,
  });
});

const UpdateEnrolledCourseController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await EnrolledCourseServices.CreateEnrolledCourseService(
    userId,
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Marks updated successfully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  CreateEnrolledCourseController,
  UpdateEnrolledCourseController,
};

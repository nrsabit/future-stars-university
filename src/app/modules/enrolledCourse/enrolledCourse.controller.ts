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
  const result = await EnrolledCourseServices.UpdateEnrolledCourseService(
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

const getAllEnrolledCoursesController = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;

  const result = await EnrolledCourseServices.getAllEnrolledCoursesService(
    facultyId,
    req.query,
  );

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMyEnrolledCoursesController = catchAsync(async (req, res) => {
  const studentId = req.user.userId;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesService(
    studentId,
    req.query,
  );

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

export const EnrolledCourseControllers = {
  CreateEnrolledCourseController,
  UpdateEnrolledCourseController,
  getAllEnrolledCoursesController,
  getMyEnrolledCoursesController,
};

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { CourseServices } from './course.service';

const createCourseController = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseService(req.body);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is Created Successfully',
    data: result,
  });
});

const getAllCoursesController = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesService(req.query);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are Retrieved Successfully',
    data: result,
  });
});

const getSingleCourseController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is Retrieved Successfully',
    data: result,
  });
});

const updateSingleCourseController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateSingleCourseService(id, req.body);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is Updated Successfully',
    data: result,
  });
});

const assignFucultiesWithCourseController = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFucultiesWithCourseService(
    courseId,
    faculties,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties are Assigned Successfully to the Course',
    data: result,
  });
});

const getCourseFacultyController = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result = await CourseServices.getCourseFacultiesService(courseId);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrived succesfully',
    data: result,
  });
});

const removeFucultiesWithCourseController = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFucultiesFromCourseService(
    courseId,
    faculties,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties are removed Successfully from the Course',
    data: result,
  });
});

const deleteCourseController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteSingleCourseService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is Deleted Successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourseController,
  getAllCoursesController,
  getSingleCourseController,
  deleteCourseController,
  updateSingleCourseController,
  assignFucultiesWithCourseController,
  getCourseFacultyController,
  removeFucultiesWithCourseController,
};

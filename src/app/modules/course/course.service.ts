import { Tcourse } from './course.interface';
import { CourseModel } from './course.model';

const createCourseService = async (payload: Tcourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCoursesService = async () => {
  const result = await CourseModel.find();
  return result;
};

const getSingleCourseService = async (id: string) => {
  const result = await CourseModel.findById(id);
  return result;
};

const deleteSingleCourseService = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseService,
  getAllCoursesService,
  getSingleCourseService,
  deleteSingleCourseService,
};

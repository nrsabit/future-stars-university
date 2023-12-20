import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { OfferedCourseModel } from './offeredCourse.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';

const getAllOfferedCoursesService = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fieldFilter();

  const result = await offeredCourseQuery.modelQuery;
  return result;
};

const createOfferedCourseService = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  // checking the semester registration.
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }
  const academicSemester = isSemesterRegistrationExists?.academicSemester;

  // checking the Academic Faculty.
  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found');
  }

  // checking the Academic Department.
  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }

  // checking the Course.
  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // checking the Faculty.
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};

const getSingleOfferedCourseService = async (id: string) => {
  const offeredCourse = await OfferedCourseModel.findById(id);

  if (!offeredCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseService = async (
  id: string,
  payload: Partial<TOfferedCourse>,
) => {
  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload);

  return result;
};

export const OfferedCourseServices = {
  getAllOfferedCoursesService,
  getSingleOfferedCourseService,
  createOfferedCourseService,
  updateOfferedCourseService,
};

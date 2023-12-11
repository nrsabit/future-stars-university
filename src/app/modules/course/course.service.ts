/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constants';
import { TCourseFaculty, Tcourse } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';

const createCourseService = async (payload: Tcourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCoursesService = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldFilter();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseService = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateSingleCourseService = async (
  id: string,
  payload: Partial<Tcourse>,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { preRequisiteCourses, ...remainingCourseInfo } = payload;

    // update basic course info.
    await CourseModel.findByIdAndUpdate(id, remainingCourseInfo, {
      new: true,
      runValidators: true,
      session,
    }).populate('preRequisiteCourses.course');

    // remove preRequisiteCourses.
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisiteCourses = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: deletedPreRequisiteCourses },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      const newPreRequisiteCourses = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisiteCourses } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
    }

    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const assignFucultiesWithCourseService = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  );

  return result;
};

const removeFucultiesFromCourseService = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { upsert: true, new: true },
  );

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
  updateSingleCourseService,
  assignFucultiesWithCourseService,
  removeFucultiesFromCourseService,
};

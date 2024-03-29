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
import { hasTimeconflict } from './offeredCourse.utils';
import { StudentModel } from '../student/student.model';

const getAllOfferedCoursesService = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fieldFilter();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.count();

  return { result, meta };
};

const getMyOfferedCoursesService = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // pagination variables.
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;
  // see if the student is exists or not.
  const student = await StudentModel.findOne({ id: userId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not found');
  }

  const semesterRegistration = await SemesterRegistrationModel.findOne({
    status: 'ONGOING',
  });

  if (!semesterRegistration) {
    throw new AppError(httpStatus.NOT_FOUND, 'No OngoingSemester Not found');
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: semesterRegistration._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentSemesterRegistration: semesterRegistration._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentSemesterRegistration',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulfilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: { isAlreadyEnrolled: false, isPreRequisitesFulfilled: true },
    },
  ];

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourseModel.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  // pagination setup
  const total = (await OfferedCourseModel.aggregate(aggregationQuery)).length;
  const totalPage = Math.ceil(result.length / page);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

const createOfferedCourseService = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
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

  // check if the academicDepartment belongs to the academicFaculty
  const isAcademicDepartmentBelongsToAcademicFaculty =
    await AcademicDepartmentModel.findOne({
      _id: academicDepartment,
      academicFaculty,
    });
  if (!isAcademicDepartmentBelongsToAcademicFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The ${isAcademicDepartmentExists.name} not belongs to the ${isAcademicFacultyExists.name}`,
    );
  }

  // check if the offered course is already exists with the same registration, course and section.
  const isOfferedCourseExistsWithSameRegistrationAndCourseAndSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (isOfferedCourseExistsWithSameRegistrationAndCourseAndSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course is already exists with same registration and section`,
    );
  }

  // check if the faculty is availave on this time or not.
  // get all booked schedules for the faculty. j
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  if (assignedSchedules?.length) {
    const newSchedule = {
      days,
      startTime,
      endTime,
    };

    // check if the time conflicts with the booked time or not.
    if (hasTimeconflict(assignedSchedules, newSchedule)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Faculty is not available in this time, please choose another time or date`,
      );
    }
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
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // check if the offered course exists or not. j
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  // check if the faculty is exists or not.
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Course not found');
  }

  // check if the semester registration status is UPCOMING
  const semesterRegistrationId = isOfferedCourseExists?.semesterRegistration;
  const semesterRegistration = await SemesterRegistrationModel.findById(
    semesterRegistrationId,
  );
  if (semesterRegistration?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Semester Registration must be upcoming',
    );
  }

  // check if the faculty is availave on this time or not.
  // get all booked schedules for the faculty. j
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration: semesterRegistrationId,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  if (assignedSchedules?.length) {
    const newSchedule = {
      days,
      startTime,
      endTime,
    };

    // check if the time conflicts with the booked time or not.
    if (hasTimeconflict(assignedSchedules, newSchedule)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Faculty is not available in this time, please choose another time or date`,
      );
    }
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload);
  return result;
};

const deleteOfferedCourseService = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found');
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistation).select(
      'status',
    );

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester is ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseServices = {
  getAllOfferedCoursesService,
  getMyOfferedCoursesService,
  getSingleOfferedCourseService,
  createOfferedCourseService,
  updateOfferedCourseService,
  deleteOfferedCourseService,
};

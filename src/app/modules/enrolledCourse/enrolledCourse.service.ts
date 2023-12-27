import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { StudentModel } from '../student/student.model';
import { EnrolledCourseModel } from './enrolledCourse.model';
import mongoose from 'mongoose';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { calculateGradeAndGradePoints } from './enrolledCourse.utils';

const CreateEnrolledCourseService = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  // check if the offered course is exists or not.
  const { offeredCourse } = payload;
  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found');
  }

  // check if the offered course capacity is still not empty.
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Offered Course Capacity is full',
    );
  }

  // check if the student is already enrolled to the course.
  const student = await StudentModel.findOne({ id: userId }, { _id: 1 });
  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Student is Already Enrolled to the Course',
    );
  }

  // the aggregation to find sum of all credits for this student in this semester.
  // get the semesterRegistration max credit.
  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');
  const maxCredit = semesterRegistration?.maxCredit;

  // get the current course credit.
  const course = await CourseModel.findById(isOfferedCourseExists.course, {
    credits: 1,
  });
  const currentCredit = course?.credits;

  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student?._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'studentEnrolledCourses',
      },
    },
    {
      $unwind: '$studentEnrolledCourses',
    },
    {
      $group: {
        _id: null,
        totalStudentCredits: { $sum: '$studentEnrolledCourses.credits' },
      },
    },
    {
      $project: { _id: 0 },
    },
  ]);

  // check if the semesterRegistration max credit is less than enrolled courses for this studen credit + current course credit or not.
  const totalCredits = enrolledCourses[0].totalStudentCredits + currentCredit;
  if (totalCredits && maxCredit && totalCredits > maxCredit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You have exeeded maximum number of credits in this semester',
    );
  }

  // now enroll to the course with transaction
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // create the new enrolled course
    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExists?.semesterRegistration,
          academicSemester: isOfferedCourseExists?.academicSemester,
          academicFaculty: isOfferedCourseExists?.academicFaculty,
          academicDepartment: isOfferedCourseExists?.academicDepartment,
          offeredCourse,
          course: isOfferedCourseExists?.course,
          student: student?._id,
          faculty: isOfferedCourseExists?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Student failed to enroll the course',
      );
    }

    // decrease offered course max capacity
    const maxCapacity = isOfferedCourseExists?.maxCapacity;
    await OfferedCourseModel.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    return err;
  }
};

const UpdateEnrolledCourseService = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student } = payload;

  // check the semester registration exists or not.
  const isSemesterRegistrationExists = await SemesterRegistrationModel.findById(
    semesterRegistration,
    { _id: 1 },
  );
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester Registration Not Found');
  }

  // check the offered course exists or not.
  const isOfferedCourseExists = await OfferedCourseModel.findById(
    offeredCourse,
    { _id: 1 },
  );
  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course Not Found');
  }

  // check the student exists or not.
  const isStudentExists = await StudentModel.findById(student, { _id: 1 });
  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student Not Found');
  }

  // check the faculty.
  const isFacultyExists = await FacultyModel.findOne(
    { id: facultyId },
    { _id: 1 },
  );

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty Not Found');
  }

  // check if the course belongs to the faculty or not.
  const isCourseBelongsToTheFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: isFacultyExists?._id,
  });

  if (!isCourseBelongsToTheFaculty) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not allowed to updated the course',
    );
  }

  // now update the data dinamically.
  const modifiedData: Record<string, unknown> = {
    ...payload.courseMarks,
  };

  // check if the finalTerm is added or not.
  if (payload?.courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm } =
      isCourseBelongsToTheFaculty.courseMarks;
    const totalNumber =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(payload?.courseMarks?.finalTerm * 0.5);

    const gradeAndMarks = calculateGradeAndGradePoints(totalNumber);
    modifiedData.grade = gradeAndMarks?.grade;
    modifiedData.gradePoints = gradeAndMarks?.gradePoints;
    modifiedData.isCompleted = true
  }

  if (payload.courseMarks && Object.entries(payload.courseMarks).length) {
    for (const [key, value] of Object.entries(payload.courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourseModel.findByIdAndUpdate(
    isCourseBelongsToTheFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

export const EnrolledCourseServices = {
  CreateEnrolledCourseService,
  UpdateEnrolledCourseService,
};

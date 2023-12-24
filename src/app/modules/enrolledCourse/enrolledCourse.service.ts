import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { StudentModel } from '../student/student.model';
import { EnrolledCourseModel } from './enrolledCourse.model';
import mongoose from 'mongoose';

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
  const student = await StudentModel.findOne({ id: userId }).select('_id');
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

export const EnrolledCourseServices = {
  CreateEnrolledCourseService,
};

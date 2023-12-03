import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import generateUserId from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const CreateStudentService = async (
  studentData: TStudent,
  password: string,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'student';

  const academicSemester = await AcademicSemesterModel.findById(
    studentData.admissionSemester,
  );

  userData.id = await generateUserId(academicSemester as TAcademicSemester);

  // creating the student in DB by using transaction and rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a new user');
    }
    studentData.id = newUser[0].id;
    studentData.user = newUser[0]._id;
    const newStudent = await StudentModel.create([studentData], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create a Student');
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  CreateStudentService,
};

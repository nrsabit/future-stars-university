/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import {
  generateAdminId,
  generateFacultyId,
  generateUserId,
} from './user.utils';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { FacultyModel } from '../faculty/faculty.model';
import { AdminModel } from '../admin/admin.model';
import { TAdmin } from '../admin/admin.interface';

const CreateStudentService = async (
  studentData: TStudent,
  password: string,
) => {
  const userData: Partial<TUser> = {};
  userData.needsPasswordChange = password ? false : true;
  userData.password = password || (config.default_pass as string);

  // adding the student role for the user.
  userData.role = 'student';

  // adding the student email for the user
  userData.email = studentData.email;

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
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const CreateFacultyService = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.needsPasswordChange = password ? false : true;
  userData.password = password || (config.default_pass as string);

  // adding the faculty role for the user.
  userData.role = 'faculty';

  // adding the faculty email for the user
  userData.email = payload.email;

  // find academic department info
  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a faculty (transaction-2)

    const newFaculty = await FacultyModel.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const CreateAdminService = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.needsPasswordChange = password ? false : true;
  userData.password = password || (config.default_pass as string);

  // adding the admin role for the user.
  userData.role = 'admin';

  // adding the admin email for the user
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMeService = async (userId: string, role: string) => {
  let result = null;
  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId }).populate('user');
  }
  if (role === 'faculty') {
    result = await FacultyModel.findOne({ id: userId }).populate('user');
  }
  if (role === 'student') {
    result = await StudentModel.findOne({ id: userId })
      .populate('admissionSemester')
      .populate('academicDepartment')
      .populate('user');
  }

  return result;
};

const changeUserStatusService = async (id: string, payload: { status: string }) => {
  const result = UserModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  CreateStudentService,
  CreateFacultyService,
  CreateAdminService,
  getMeService,
  changeUserStatusService,
};

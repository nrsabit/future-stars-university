import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserModel } from '../user/user.model';
import { TStudent } from './student.interface';

// services for student.
const GetAllStudentsService = async () => {
  const result = await StudentModel.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

const GetSingleStudentService = async (studentId: string) => {
  const result = await StudentModel.findOne({ id: studentId })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return result;
};

const UpdateStudentService = async (id: string, payLoad: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingData } = payLoad;
  const modifiedUpdatedData: Record<string, unknown> = { ...remainingData };

  if (name && Object.keys(name)) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await StudentModel.findOneAndUpdate(
    { id },
    modifiedUpdatedData,
    { new: true },
  );
  return result;
};

const DeleteStudentService = async (studentId: string) => {
  const session = await mongoose.startSession();
  const student = await StudentModel.isUserExists(studentId);
  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student does not exists');
  }
  try {
    session.startTransaction();
    const deletedUser = await UserModel.findOneAndUpdate(
      { id: studentId },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User was not deleted');
    }
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id: studentId },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Student was not deleted');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Student Deletion was not completed');
  }
};

export const StudentServices = {
  GetAllStudentsService,
  GetSingleStudentService,
  DeleteStudentService,
  UpdateStudentService,
};

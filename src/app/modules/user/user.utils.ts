import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

// Student ID
const getLastStudent = async () => {
  const lastStudent = await UserModel.findOne(
    { role: 'student' },
    { _id: 0, id: 1 },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id || undefined;
};

export const generateUserId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const lastStudent = await getLastStudent();
  const lastStudentYear = lastStudent?.substring(0, 4);
  const lastStudentSemesterCode = lastStudent?.substring(4, 6);
  if (
    lastStudent &&
    lastStudentYear === payload.year &&
    lastStudentSemesterCode === payload.code
  ) {
    currentId = lastStudent.substring(6);
  }
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const generatedId = `${payload.year}${payload.code}${incrementId}`;
  return generatedId;
};

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await UserModel.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};

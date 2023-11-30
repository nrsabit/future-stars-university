import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

const getLastStudent = async () => {
  const lastStudent = await UserModel.findOne(
    { role: 'student' },
    { _id: 0, id: 1 },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id || undefined;
};

const generateUserId = async (payload: TAcademicSemester) => {
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

export default generateUserId;

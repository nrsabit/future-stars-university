import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

const getLastStudent = async () => {
  const lastStudent = await UserModel.findOne(
    { role: 'student' },
    { _id: 0, id: 1 },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id.substring(6) || undefined;
};

const generateUserId = async (academicSemester: TAcademicSemester) => {
  const currentId = (await getLastStudent()) || (0).toString();
  const incrementId = (Number(currentId )+ 1)
    .toString()
    .padStart(4, '0');
  const generatedId = `${academicSemester.year}${academicSemester.code}${incrementId}`;
  return generatedId;
};

export default generateUserId;

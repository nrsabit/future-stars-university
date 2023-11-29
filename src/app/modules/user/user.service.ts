import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const CreateStudentService = async (
  studentData: TStudent,
  password: string,
) => {
  const id = '203000001';
  const userPass = password || (config.default_pass as string);

  const userData: Partial<TUser> = {
    id: id,
    role: 'student',
    password: userPass,
  };

  // creating the student in DB
  const newUser = await UserModel.create(userData);
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;
    const result = await StudentModel.create(studentData)
    return result
  }
};

export const UserServices = {
  CreateStudentService,
};

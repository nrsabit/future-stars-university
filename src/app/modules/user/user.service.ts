import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import generateUserId from './user.utils';

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

  // creating the student in DB
  const newUser = await UserModel.create(userData);
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id;
    const result = await StudentModel.create(studentData);
    return result;
  }
};

export const UserServices = {
  CreateStudentService,
};

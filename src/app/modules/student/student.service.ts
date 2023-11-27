import { TStudent } from './student.interface';
import { StudentModel } from './student.model';

// services for student.
const CreateStudentService = async (studentData: TStudent) => {
  // checking the student already exists or not by using custom instance method.
  // const student = new StudentModel(studentData)
  // if(await student.isUserExists(student.id)){
  //   throw new Error('User already exists in DB')
  // }

  // checking the student is exists in Db or not, by using custom static method.
  if (await StudentModel.isUserExists(studentData.id)) {
    throw new Error('User already exists in DB (from static)');
  }

  // creating the student in DB
  const result = await StudentModel.create(studentData);

  // another way to create the student by using the build it instance method
  // const student = new StudentModel(studentData);
  // const result2 = await student.save();
  return result;
};

const GetAllStudentsService = async () => {
  const result = await StudentModel.find();
  return result;
};

const GetSingleStudentService = async (studentId: string) => {
  const result = await StudentModel.findOne({ id: studentId });
  return result;
};

const DeleteStudentService = async (studentId: string) => {
  const result = await StudentModel.updateOne({ id: studentId }, {isDeleted : true});
  return result;
};

export const StudentServices = {
  CreateStudentService,
  GetAllStudentsService,
  GetSingleStudentService,
  DeleteStudentService
};

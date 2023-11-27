import { StudentModel } from './student.model';

// services for student.
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
  GetAllStudentsService,
  GetSingleStudentService,
  DeleteStudentService
};

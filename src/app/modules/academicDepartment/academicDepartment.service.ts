import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';

const CreateAcademicDepartmentService = async (
  payload: TAcademicDepartment,
) => {
  const result = await AcademicDepartmentModel.create(payload);
  return result;
};

const GetAllAcademicDepartmentsService = async () => {
  const result = await AcademicDepartmentModel.find();
  return result;
};

const GetSingleAcademicDepartmentsService = async (departmentId: string) => {
  const result = await AcademicDepartmentModel.findById(departmentId);
  return result;
};

const UpdateSingleAcademicDepartmentsService = async (
  departmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartmentModel.findByIdAndUpdate(
    departmentId,
    payload,
  );
  return result;
};

export const AcademicDepartmentServices = {
  CreateAcademicDepartmentService,
  GetAllAcademicDepartmentsService,
  GetSingleAcademicDepartmentsService,
  UpdateSingleAcademicDepartmentsService,
};

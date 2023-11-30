import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const CreateAcademicFaculyService = async (payLoad: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payLoad);
  return result;
};

const GetAllAcademicFacultiesService = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

const GetSingleAcademicFacultiesService = async (facultyId: string) => {
  const result = await AcademicFacultyModel.findById(facultyId);
  return result;
};

const UpdateSingleAcademicFacultiesService = async (
  facultyId: string,
  payLoad: TAcademicFaculty,
) => {
  const result = await AcademicFacultyModel.findByIdAndUpdate(
    facultyId,
    payLoad,
  );
  return result;
};

export const AcademicFacultyServices = {
  CreateAcademicFaculyService,
  GetAllAcademicFacultiesService,
  GetSingleAcademicFacultiesService,
  UpdateSingleAcademicFacultiesService,
};

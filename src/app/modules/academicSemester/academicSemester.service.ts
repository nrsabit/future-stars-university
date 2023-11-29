import { AcademicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

const CreateAcademicSemesterService = async (payload: TAcademicSemester) => {
  // check the semester name matches with code or not.
  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

const GetAllAcademicSemestersService = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

const GetSingleAcademinSemesterService = async (id: string) => {
  const result = await AcademicSemesterModel.findById(id);
  return result;
};

const UpdateSingleAcademicSemesterSErvice = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    AcademicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicSemesterServices = {
  CreateAcademicSemesterService,
  GetAllAcademicSemestersService,
  GetSingleAcademinSemesterService,
  UpdateSingleAcademicSemesterSErvice
};

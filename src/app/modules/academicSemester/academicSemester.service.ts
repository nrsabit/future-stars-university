import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  AcademicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const CreateAcademicSemesterService = async (payload: TAcademicSemester) => {
  // check the semester name matches with code or not.
  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Invalid Semester Code');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

const GetAllAcademicSemestersService = async (
  query: Record<string, unknown>,
) => {
  const academicSemestersQuery = new QueryBuilder(
    AcademicSemesterModel.find(),
    query,
  )
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldFilter();

  const meta = await academicSemestersQuery.count();
  const result = await academicSemestersQuery.modelQuery;

  return { result, meta };
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
    throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Invalid Semester Code');
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
  UpdateSingleAcademicSemesterSErvice,
};

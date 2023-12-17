import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllSemesterRegistrationsService = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fieldFilter();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationService = async (id: string) => {
  const result = await SemesterRegistrationModel.findById(id);
  return result;
};

const createSemesterRegistrationService = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;
  const isAcademicSemesterExists =
    await AcademicSemesterModel.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Semester not found');
  }

  const isAcademicRegistrationExists = await SemesterRegistrationModel.findOne({
    academicSemester,
  });
  if (isAcademicRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Academic Registration already exists',
    );
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

const updateSemesterRegistrationService = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );
  return result;
};

export const SemesterRegistrationServices = {
  getAllSemesterRegistrationsService,
  getSingleSemesterRegistrationService,
  createSemesterRegistrationService,
  updateSemesterRegistrationService,
};

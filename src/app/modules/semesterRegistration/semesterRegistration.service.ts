import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatusObj } from './semesterRegistration.constant';

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
  // check if there is alreay any 'UPCOMING' or 'ONGOING' semester registration or not.
  const isUpcomingOrOngoingSemesterExists =
    await SemesterRegistrationModel.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });
  if (isUpcomingOrOngoingSemesterExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isUpcomingOrOngoingSemesterExists.status} Semester exists`,
    );
  }

  // check if the academicSemester exists or not.
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
  // check if the semester is exists or not.
  const currentSemesterRegestration =
    await SemesterRegistrationModel.findById(id);
  if (!currentSemesterRegestration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester Registration Not Found.',
    );
  }

  // check if the semester is already ended. (we will not allow to edit that.)
  const semesterRegistrationStatus = currentSemesterRegestration?.status;
  const requestedStatus = payload?.status;
  if (semesterRegistrationStatus === RegistrationStatusObj.ended) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Semester Registration is Ended.',
    );
  }

  // logic for not allowing status change from 'UPCOMING' to 'ENDED' directly.
  if (
    semesterRegistrationStatus === RegistrationStatusObj.upcoming &&
    requestedStatus === RegistrationStatusObj.ended
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot change the status directly from ${semesterRegistrationStatus} to ${requestedStatus}`,
    );
  }

  // logic for not allowing status change from 'ONGOING' to 'UPCOMING' directly.
  if (
    semesterRegistrationStatus === RegistrationStatusObj.ongoing &&
    requestedStatus === RegistrationStatusObj.upcoming
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You cannot change the status directly from ${semesterRegistrationStatus} to ${requestedStatus}`,
    );
  }

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

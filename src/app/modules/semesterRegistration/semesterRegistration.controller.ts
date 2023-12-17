import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const getAllSemesterRegistrationsController = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsService(
      req.query,
    );

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registrations are retrived Successfully',
    data: result,
  });
});

const getSingleSemesterRegistrationController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationService(id);

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registrations is retrived Successfully',
    data: result,
  });
});

const createSemesterRegistrationController = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationService(
      req.body,
    );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration is Created Successfully',
    data: result,
  });
});

const updateSemesterRegistrationController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationService(
      id,
      req.body,
    );

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester Registration is Updated Successfully',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  getAllSemesterRegistrationsController,
  getSingleSemesterRegistrationController,
  createSemesterRegistrationController,
  updateSemesterRegistrationController,
};

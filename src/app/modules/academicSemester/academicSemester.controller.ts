import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { AcademicSemesterServices } from './academicSemester.service';

const CreateAcademicSemesterController = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.CreateAcademicSemesterService(
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Created Successfully',
    data: result,
  });
});

const GetAllAcademicSemesterController = catchAsync(async (req, res) => {
  const result =
    await AcademicSemesterServices.GetAllAcademicSemestersService();
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semesters retrieved Successfully',
    data: result,
  });
});

const GetSingleAcademicSemesterController = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.GetSingleAcademinSemesterService(semesterId);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester retrieved Successfully',
    data: result,
  });
});

const UpdateSingleAcademicSemesterController = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.UpdateSingleAcademicSemesterSErvice(
      semesterId,
      req.body,
    );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester Updated Successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  CreateAcademicSemesterController,
  GetAllAcademicSemesterController,
  GetSingleAcademicSemesterController,
  UpdateSingleAcademicSemesterController,
};

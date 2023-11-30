import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { AcademicFacultyServices } from './academicFaculty.service';

const CreateAcademicFacultyController = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.CreateAcademicFaculyService(
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is Created Successfully',
    data: result,
  });
});

const GetAllAcademicFacultiesController = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.GetAllAcademicFacultiesService();
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculties are retrieved Successfully',
    data: result,
  });
});

const GetSingleAcademicFacultyController = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await AcademicFacultyServices.GetSingleAcademicFacultiesService(facultyId);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is retrieved Successfully',
    data: result,
  });
});

const UpdateSingleAcademicFacultyController = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await AcademicFacultyServices.UpdateSingleAcademicFacultiesService(
      facultyId,
      req.body,
    );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty is updated Successfully',
    data: result,
  });
});

export const AcademicFacultyControllers = {
  CreateAcademicFacultyController,
  GetAllAcademicFacultiesController,
  GetSingleAcademicFacultyController,
  UpdateSingleAcademicFacultyController,
};

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { AcademicDepartmentServices } from './academicDepartment.service';

const GetAllAcademicDepartmentsController = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.GetAllAcademicDepartmentsService();
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments are Retrieved Successfully',
    data: result,
  });
});

const GetSingleAcademicDepartmentsController = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.GetSingleAcademicDepartmentsService(
      departmentId,
    );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is Retrieved Successfully',
    data: result,
  });
});

const CreateSingleAcademicDepartmentsController = catchAsync(
  async (req, res) => {
    const result =
      await AcademicDepartmentServices.CreateAcademicDepartmentService(
        req.body,
      );
    responseHandler(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is Created Successfully',
      data: result,
    });
  },
);

const UpdateSingleAcademicDepartmentsController = catchAsync(
  async (req, res) => {
    const { departmentId } = req.params;
    const result =
      await AcademicDepartmentServices.UpdateSingleAcademicDepartmentsService(
        departmentId,
        req.body,
      );
    responseHandler(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department is Updated Successfully',
      data: result,
    });
  },
);

export const AcademicDepartmentControllers = {
  GetAllAcademicDepartmentsController,
  GetSingleAcademicDepartmentsController,
  CreateSingleAcademicDepartmentsController,
  UpdateSingleAcademicDepartmentsController,
};

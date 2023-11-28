import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import httpStatus from 'http-status';
import responseHandler from '../../utils/responseHandler';

// the controllers for student.

const GetAllStudentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.GetAllStudentsService();
    responseHandler(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Students are retrived Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const GetSingleStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.GetSingleStudentService(studentId);
    responseHandler(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is retrived Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const DeleteSingleStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.DeleteStudentService(studentId);
    responseHandler(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student is deleted Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const StudentControllers = {
  GetAllStudentsController,
  GetSingleStudentController,
  DeleteSingleStudentController,
};

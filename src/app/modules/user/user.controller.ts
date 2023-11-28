import { NextFunction, Request, Response } from 'express';
// import studentValidationSchema from "../student/student.validation";
import { UserServices } from './user.service';
import responseHandler from '../../utils/responseHandler';
import httpStatus from 'http-status';

const CreateStudentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { student: studentData } = req.body;
    const { password } = req.body;
    //   const zodParsedData = studentValidationSchema.parse(studentData);
    const result = await UserServices.CreateStudentService(
      password,
      studentData,
    );
    responseHandler(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Created Successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const UserControllers = {
  CreateStudentController,
};

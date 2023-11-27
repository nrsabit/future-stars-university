import { Request, Response } from 'express';
import { StudentServices } from './student.service';

// the controllers for student.

const GetAllStudentsController = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.GetAllStudentsService();
    res.status(200).json({
      success: true,
      message: 'Students are retrived Successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

const GetSingleStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.GetSingleStudentService(studentId);
    res.status(200).json({
      success: true,
      message: 'Student is retrived Successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

const DeleteSingleStudentController = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.DeleteStudentService(studentId);
    res.status(200).json({
      success: true,
      message: 'Student is deleted Successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

export const StudentControllers = {
  GetAllStudentsController,
  GetSingleStudentController,
  DeleteSingleStudentController
};

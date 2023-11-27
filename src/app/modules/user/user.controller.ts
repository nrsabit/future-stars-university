import { Request, Response } from "express";
// import studentValidationSchema from "../student/student.validation";
import { UserServices } from "./user.service";

const CreateStudentController = async (req: Request, res: Response) => {
    try {
      const { student: studentData  } = req.body;
      const {password} = req.body
    //   const zodParsedData = studentValidationSchema.parse(studentData);
      const result = await UserServices.CreateStudentService(password, studentData);
      res.status(200).json({
        success: true,
        message: 'Student Created Successfully',
        data: result,
      });
    } catch (err : any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong',
        error: err,
      });
    }
  };

  export const UserControllers = {
    CreateStudentController
  }
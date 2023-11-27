import { Model, Types } from "mongoose";

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user : Types.ObjectId;
  name: UserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg: string;
  isDeleted: boolean;
};

// adding the custom method for checking is the exists or not. (custom instance method.)
export interface StudentMethods {
  isUserExists (id : string) : Promise<TStudent | null>
}

// interface for custom static method, with the method itself. 
export interface StudentModelForStatic extends Model<TStudent> {
  isUserExists (id : string) : Promise<TStudent | null>
}

// this is a new model to create the instance. (custom instance method.)
export type StudentModelForInstance = Model<TStudent, Record<string, never>, StudentMethods>;

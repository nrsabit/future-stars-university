import { Schema, model } from 'mongoose';
import {
  // StudentMethods,
  // StudentModelForInstance,
  StudentModelForStatic,
  TGuardian,
  TLocalGuardian,
  TStudent,
  UserName,
} from './student.interface';

const UserNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    validate: {
      validator: function (value: string) {
        const words = value.toLowerCase().slice(1);
        const capitalizedWord = value.charAt(0).toUpperCase() + words;
        return value === capitalizedWord;
      },
      message: 'First Name is not in Capitalized Format.',
    },
  },
  middleName: { type: String },
  lastName: { type: String, required: [true, 'Last Name is Required'] },
});

const GuardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: true,
    maxlength: [20, 'Father name must be within 20 characters.'],
  },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});

const LocalGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

// student schema for static instance method.
const StudentSchema = new Schema<TStudent, StudentModelForStatic>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    name: { type: UserNameSchema, required: true },
    gender: {
      type: String,
      enum: {
        values: ['female', 'male', 'other'],
        message: 'Value Must be male or female',
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: { type: String , unique : true},
    contactNo: { type: String },
    emergencyContactNo: { type: String },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permenent Address is Required'],
    },
    guardian: { type: GuardianSchema, required: true },
    localGuardian: { type: LocalGuardianSchema, required: true },
    profileImg: { type: String, required: true },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicSemester',
    },
    academicDepartment : {type : Schema.Types.ObjectId, required : true, ref : 'AcademicDepartment'},
    isDeleted: { type: Boolean, required: true, default: false },
  },
  { toJSON: { virtuals: true }, timestamps: true },
);

// query hook. to remove the isDeleted : true data.
StudentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// removing deleted data for findOne.
StudentSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  // console.log(this); to console the query
  next();
});

// removing deleted data for aggregate.
StudentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// adding the virtual field for fullName.
StudentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// for custom instance method.
StudentSchema.methods.isUserExists = async (id: string) => {
  const existingUser = await StudentModel.findOne({ id });
  return existingUser;
};

// for custom static method.
StudentSchema.statics.isUserExists = async (id: string) => {
  const existingUser = await StudentModel.findOne({ id });
  return existingUser;
};

// Student main model to create the custom static method.
export const StudentModel = model<TStudent, StudentModelForStatic>(
  'Student',
  StudentSchema,
);

// Student main Model to create the instance custom method.
// export const StudentModel = model<TStudent, StudentModelForInstance>(
//   'Student',
//   StudentSchema,
// );

import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const AcademicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  { timestamps: true },
);

// pre hook middlewares.
// middleware to check duplicate name.
AcademicDepartmentSchema.pre('save', async function (next) {
  const isNameExists = await AcademicDepartmentModel.findById(this._id);
  if (isNameExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Name already exists');
  }
  next();
});

// middleware to check data if exists when updating
AcademicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepertmentExists = await AcademicDepartmentModel.findOne(query);
  if (!isDepertmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Department does not exists');
  }
  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  AcademicDepartmentSchema,
);

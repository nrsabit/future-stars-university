import { Schema, model } from 'mongoose';
import { TCourseFaculty, Tcourse } from './course.interface';

const preRequisiteCoursesSchema = new Schema({
  course: { type: Schema.Types.ObjectId, required: true, ref: 'Course' },
  isDeleted: { type: Boolean, default: false },
});

const courseSchema = new Schema<Tcourse>({
  title: { type: String, unique: true, required: true, trim: true },
  prefix: { type: String, required: true, trim: true },
  code: { type: Number, required: true, trim: true, unique: true },
  credits: { type: Number, required: true, trim: true },
  isDeleted: { type: Boolean, required: true, default: false },
  preRequisiteCourses: [preRequisiteCoursesSchema],
});

export const CourseModel = model<Tcourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>({
  course: { type: Schema.Types.ObjectId, unique: true, ref: 'Course' },
  faculties: { type: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }] },
});

export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);

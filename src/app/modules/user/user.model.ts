import { Schema, model } from 'mongoose';
import { TUser, UserStaticsModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { USER_STATUS } from './user.constant';

const UserSchema = new Schema<TUser, UserStaticsModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, required: true, default: true },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['super-admin', 'admin', 'student', 'faculty'] },
    status: { type: String, enum: USER_STATUS, default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// pre and post query hooks to encrypt the password.
// pre hook for save. to convert the password as hash. will run before the call
UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// post hook for save. to convert the password as empty. will run after the call.
UserSchema.post('save', async function (doc, next) {
  doc.password = '';
  next();
});

// static method to check the user exists or not
UserSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await UserModel.findOne({ id }).select('+password');
};

// static method to check the password is matched for the user.
UserSchema.statics.isPasswordMatched = async function (
  plainTextedPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextedPassword, hashedPassword);
};

// static method to check the password changed after token issue or not.
UserSchema.statics.isJWTIssuedTimeBeforePasswordChanged = function (
  passwordChangedTime: Date,
  tokenIssuedTime: number,
) {
  const passwordChangedTimeMiliseconds = new Date(
    passwordChangedTime,
  ).getTime() / 1000;

  return passwordChangedTimeMiliseconds > tokenIssuedTime;
};

export const UserModel = model<TUser, UserStaticsModel>('User', UserSchema);

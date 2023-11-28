import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const UserSchema = new Schema<TUser>(
  {
    id: { type: String, required: true , unique : true},
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, required: true, default: true },
    role: { type: String, enum: ['admin', 'student', 'faculty'] },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
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

export const UserModel = model<TUser>('User', UserSchema);

import { Model } from 'mongoose';
import { USER_ROLES } from './user.constant';

export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'superAdmin' | 'admin' | 'faculty' | 'student';
  status: 'active' | 'blocked';
  isDeleted: boolean;
}

export type TUserRoles = keyof typeof USER_ROLES;

export interface UserStaticsModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextedPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedTimeBeforePasswordChanged(
    passwordChangedTime: Date,
    tokenIssuedTime: number,
  ): boolean;
}

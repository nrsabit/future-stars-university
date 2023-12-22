import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';

const LoginUserService = async (payload: TLoginUser) => {
  // check if the user is exists or not.
  const isUserExists = await UserModel.findOne({ id: payload?.id });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found..!');
  }

  // check if the user deleted or not.
  const isUserDeleted = isUserExists?.isDeleted;
  if (isUserDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Deleted..!');
  }

  // check if the user is blocked or not.
  const userStatus = isUserExists?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked..!');
  }

  // check if the password is matched or not.
  const passwordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password,
  );
  if (!passwordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password');
  }

  console.log('logged is successfully');
};

export const AuthServices = {
  LoginUserService,
};

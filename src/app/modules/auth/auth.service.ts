import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../user/user.model';
import { TChangePassword, TLoginUser } from './auth.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';

const LoginUserService = async (payload: TLoginUser) => {
  // check if the user is exists or not.
  const user = await UserModel.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found..!');
  }

  // check if the user deleted or not.
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Deleted..!');
  }

  // check if the user is blocked or not.
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked..!');
  }

  // check if the password is matched or not.
  if (!(await UserModel.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password');
  }

  // authorize the user using jwt
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const ChangePasswordService = async (
  userId: string,
  payload: TChangePassword,
) => {
  // check if the user is exists or not.
  const user = await UserModel.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found..!');
  }

  // check if the user deleted or not.
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Deleted..!');
  }

  // check if the user is blocked or not.
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked..!');
  }

  // check if the password is matched or not.
  if (
    !(await UserModel.isPasswordMatched(payload?.oldPassword, user?.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password');
  }

  // encrypt the newly added password.
  const hashedNewPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    { id: userId, role: user?.role },
    {
      password: hashedNewPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const useRefreshTokenService = async (token: string) => {
  // check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;
  // check if the user is exists or not.
  const user = await UserModel.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found..!');
  }

  // check if the user deleted or not.
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Deleted..!');
  }

  // check if the user is blocked or not.
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked..!');
  }

  // check the password change time is before jwt access token or not
  if (
    user?.passwordChangedAt &&
    UserModel.isJWTIssuedTimeBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Unauthorized Access');
  }

  // authorize the user using jwt
  const jwtPayload = {
    userId: user?.id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_expires_in as string,
  );

  return { accessToken };
};

export const AuthServices = {
  LoginUserService,
  ChangePasswordService,
  useRefreshTokenService,
};

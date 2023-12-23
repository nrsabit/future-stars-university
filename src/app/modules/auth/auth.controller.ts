import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { AuthServices } from './auth.service';
import config from '../../config';

const LoginUserController = catchAsync(async (req, res) => {
  const result = await AuthServices.LoginUserService(req.body);
  const { accessToken, refreshToken, needsPasswordChange } = result;

  // set the refresh token in cookie.
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Successfully logged in',
    data: { accessToken, needsPasswordChange },
  });
});

const ChangePasswordController = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await AuthServices.ChangePasswordService(userId, req.body);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Changed Successfully',
    data: result,
  });
});

const UseRefreshTokenController = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.useRefreshTokenService(refreshToken);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token Updated Successfully',
    data: result,
  });
});

const ForgetPasswordController = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await AuthServices.forgetPasswordService(id);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Forget Password Link Generated Successfully',
    data: result,
  });
});

const ResetPasswordController = catchAsync(async (req, res) => {
  const token = req?.headers?.authorization;
  const result = await AuthServices.resetPasswordService(
    token as string,
    req.body,
  );
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset Successful',
    data: result,
  });
});

export const Authcontrollers = {
  LoginUserController,
  ChangePasswordController,
  UseRefreshTokenController,
  ForgetPasswordController,
  ResetPasswordController
};

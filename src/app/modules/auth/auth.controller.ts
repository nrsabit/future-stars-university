import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import responseHandler from '../../utils/responseHandler';
import { AuthServices } from './auth.service';

const LoginUserController = catchAsync(async (req, res) => {
  const result = await AuthServices.LoginUserService(req.body);
  responseHandler(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Successfully logged in',
    data: result,
  });
});

export const Authcontrollers = {
  LoginUserController,
};

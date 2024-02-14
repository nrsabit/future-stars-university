import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';
import { UserModel } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // check if the token received or not.
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    // check if the token is valid
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_token as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    const { userId, role, iat } = decoded;
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

    // check the role of the user.
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;

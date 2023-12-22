import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRoles } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRoles[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // check if the token received or not.
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
    }

    // check if the token is valid
    jwt.verify(token, config.jwt_access_token as string, (err, decoded) => {
      if (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
      }
      const authorizedRole = (decoded as JwtPayload)?.role;
      if (requiredRoles && !requiredRoles.includes(authorizedRole)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
      }

      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;

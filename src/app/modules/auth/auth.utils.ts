import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  token: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, token, {
    expiresIn,
  });
};

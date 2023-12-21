import { TLoginUser } from './auth.interface';

const LoginUserService = async (payload: TLoginUser) => {
    return payload
};

export const AuthServices = {
    LoginUserService,
};

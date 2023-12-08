import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

const HandleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    },
  );

  const status = 400;
  return {
    status,
    message: 'Validation Error',
    errorSources,
  };
};

export default HandleValidationError;

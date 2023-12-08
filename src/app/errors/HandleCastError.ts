import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const status = 400;
  return {
    status,
    message: 'Invalid ID',
    errorSources,
  };
};

export default handleCastError;

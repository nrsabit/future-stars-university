import mongoose from 'mongoose';

const HandleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val.path,
        message: val.message,
      };
    },
  );

  return {
    status: 400,
    message: 'Validation Error',
    errorSources,
    stack: err?.stack,
  };
};

export default HandleValidationError;

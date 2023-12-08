/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const errorSources = [
    {
      path: Object.keys(err.keyPattern)[Object.keys(err.keyPattern).length - 1],
      message: `${
        Object.values(err.keyValue)[Object.values(err.keyValue).length - 1]
      } is already exists`,
    },
  ];
  const status = 400;
  return {
    status,
    message: 'Duplicate Error',
    errorSources,
  };
};

export default handleDuplicateError;

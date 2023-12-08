import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError) : TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues?.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const status = 400;
  return {
    status,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;

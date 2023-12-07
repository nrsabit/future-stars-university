import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';

const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSources = err.issues?.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    status: 400,
    message: 'Validation Error',
    errorSources,
    stack: err.stack,
  };
};

export default handleZodError;

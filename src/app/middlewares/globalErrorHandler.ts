/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import { ZodError } from 'zod';
import config from '../config';
import handleZodError from '../errors/HandleZodError';
import HandleValidationError from '../errors/HandleValidationError';

const globalErrorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong..!',
    },
  ];

  // change the message and error source if it's a zod error
  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    status = simplifiedZodError.status;
    message = simplifiedZodError.message;
    errorSources = simplifiedZodError.errorSources;
  } else if (err.name === 'ValidationError') {
    const simplifiedMongooseError = HandleValidationError(err);
    status = simplifiedMongooseError.status;
    message = simplifiedMongooseError.message;
    errorSources = simplifiedMongooseError.errorSources;
  }

  res.status(status).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

/*
our error response type will be like: 
{
  success : false,
  message : 'Validation error',
  errorSources : [
    {
      path : name,
      message : 'name is required'
    }
  ],
  stack : 'code stack if available, ' or null
}
*/

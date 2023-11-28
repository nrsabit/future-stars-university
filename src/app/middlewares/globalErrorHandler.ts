/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err : any, req : Request, res : Response, next : NextFunction) => {
    const status = 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({
        success : false,
        message,
        err : err
    })
}

export default globalErrorHandler
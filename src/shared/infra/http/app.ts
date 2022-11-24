import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';

import '@shared/container';
import { AppError } from '@shared/errors/AppError';

import { routes } from './routes';

export const app = express();

app.use(express.json());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      type: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);

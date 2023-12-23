import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();

// parsers.
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: ['http://localhost:5173']}));

// application routes.
app.use('/api/v1', router);

app.get('/', async (req: Request, res: Response) => {
  res.send('Future Starts University');
});

// global error handler funciton.
app.use(globalErrorHandler);
// not found handler for invalid routes
app.use(notFound);
export default app;

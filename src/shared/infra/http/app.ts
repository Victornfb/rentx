import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import SwaggerUi from 'swagger-ui-express';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { router } from '@shared/infra/http/routes';
import swaggerFile from '../../../swagger.json';
import createConnection from '@shared/infra/typeorm';
import '@shared/container';
import { AppError } from '@shared/errors/AppError';
import upload from '@config/upload';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';

createConnection();
const app = express();

app.use(express.json());

app.use(rateLimiter);

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Tracing.Integrations.Express({ app }),
		],
		tracesSampleRate: 1.0,
	});

	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
}

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerFile));
app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(router);

app.use(Sentry.Handlers.errorHandler());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			message: err.message,
		});
	}

	return res.status(500).json({
		status: 'error',
		message: `Internal server error: ${err.message}`,
	});
})

export { app };
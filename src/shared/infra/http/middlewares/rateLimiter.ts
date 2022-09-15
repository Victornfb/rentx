import { createClient } from 'redis';
import { RateLimiterRedis } from "rate-limiter-flexible";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@shared/errors/AppError";

const redisClient = createClient({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	enable_offline_queue: false,
});

const limiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: 'rateLimiter',
	points: 7,
	duration: 5,
});

export default async function rateLimiter(
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> {
	try {
		await limiter.consume(req.ip);
		return next();
	} catch (err) {
		throw new AppError('Too many requests', 429);
	}
}
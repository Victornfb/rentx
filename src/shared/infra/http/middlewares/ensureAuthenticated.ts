import { AppError } from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import auth from "@config/auth";

interface IPayload {
	sub: string;
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new AppError('Invalid authorization header', 401);
	}

	const [, token] = authHeader.split(' ');

	let user_id = undefined;

	try {
		const { sub } = verify(token, auth.secret_refresh_token) as IPayload;
		user_id = sub;
	} catch (err) {
		throw new AppError('Invalid token', 401);
	}

	const userTokensRepository = new UsersTokensRepository();

	const user = await userTokensRepository.findByUserIdAndRefreshToken(user_id, token);

	if (!user) {
		throw new AppError('User token not found', 401);
	}

	req.user = {
		id: user_id,
	};

	next();
}
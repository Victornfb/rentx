import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

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
		const { sub } = verify(token, 'a286a8e8fe50b793a0134baabddc9a14') as IPayload;
		user_id = sub;
	} catch (err) {
		throw new AppError('Invalid token', 401);
	}

	const usersRepository = new UsersRepository();

	const user = await usersRepository.findById(user_id);

	if (!user) {
		throw new AppError('User not found', 401);
	}

	req.user = {
		id: user_id,
	};

	next();
}
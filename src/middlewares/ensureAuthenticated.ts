import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
	sub: string;
}

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new Error('Invalid authorization header');
	}

	const [, token] = authHeader.split(' ');

	let user_id = undefined;

	try {
		const { sub } = verify(token, 'a286a8e8fe50b793a0134baabddc9a14') as IPayload;
		user_id = sub;
	} catch (err) {
		throw new Error('Invalid token');
	}

	const usersRepository = new UsersRepository();

	const user = await usersRepository.findById(user_id);

	if (!user) {
		throw new Error('User not found');
	}

	next();
}
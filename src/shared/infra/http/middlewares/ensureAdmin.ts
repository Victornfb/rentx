import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";

export async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
	const { id } = req.user;

	const usersRepository = new UsersRepository();
	const user = await usersRepository.findById(id);

	if (!user.is_admin) {
		throw new AppError('User is not an admin');
	}

	return next();
}
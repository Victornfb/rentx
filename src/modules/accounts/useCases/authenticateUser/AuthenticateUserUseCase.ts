import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IRequest {
	email: string;
	password: string;
}

interface IResponse {
	user: {
		id: string;
		name: string;
		email: string;
	};
	token: string;
	refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('UsersTokensRepository')
		private usersTokensRepository: IUserTokensRepository,
		@inject('DayjsDateProvider')
		private dateProvider: IDateProvider
	) {}

	async execute({ email, password }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);
		const { secret_token, expires_in_token, secret_refresh_token, expires_in_refresh_token, expires_in_refresh_token_days } = auth;

		if (!user) {
			throw new AppError('Email or password incorrect');
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new AppError('Email or password incorrect');
		}

		const token = sign({}, secret_token, {
			subject: user.id,
			expiresIn: expires_in_token,
		});

		const refreshToken = sign({ email }, secret_refresh_token, {
			subject: user.id,
			expiresIn: expires_in_refresh_token,
		});

		await this.usersTokensRepository.create({
			user_id: user.id,
			refresh_token: refreshToken,
			expires_date: this.dateProvider.addDays(expires_in_refresh_token_days),
		});

		const tokenReturn: IResponse = {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token,
			refresh_token: refreshToken,
		};

		return tokenReturn;
	}
}

export { AuthenticateUserUseCase }
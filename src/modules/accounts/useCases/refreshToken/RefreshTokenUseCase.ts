import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository"
import { inject, injectable } from "tsyringe"
import { sign, verify } from "jsonwebtoken"
import auth from "@config/auth"
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

interface IPayload {
	sub: string;
	email: string;
}

interface ITokenResponse {
	token: string;
	refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
	constructor(
		@inject('UsersTokensRepository')
		private usersTokensRepository: IUserTokensRepository,
		@inject('DayjsDateProvider')
		private dateProvider: IDateProvider
	) {}

	async execute(token: string): Promise<ITokenResponse> {
		const {
			sub: user_id,
			email
		} = verify(token, auth.secret_refresh_token) as IPayload;

		const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

		if (!userToken) {
			throw new AppError('Refresh token does not exists');
		}

		await this.usersTokensRepository.deleteById(userToken.id);
		
		const refreshToken = sign({ email }, auth.secret_refresh_token, {
			subject: user_id,
			expiresIn: auth.expires_in_refresh_token,
		});

		await this.usersTokensRepository.create({
			user_id,
			refresh_token: refreshToken,
			expires_date: this.dateProvider.addDays(auth.expires_in_refresh_token_days),
		});

		const newToken = sign({}, auth.secret_token, {
			subject: user_id,
			expiresIn: auth.expires_in_token,
		});

		return {
			token: newToken,
			refresh_token: refreshToken,
		};
	}
}

export { RefreshTokenUseCase }
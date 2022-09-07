import { ICreateUserTokensDTO } from "@modules/accounts/dtos/ICreateUserTokensDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";
import { IUserTokensRepository } from "../IUserTokensRepository";

class UserTokensRepositoryInMemory implements IUserTokensRepository {
	usersTokens: UserTokens[] = [];

	async create({ expires_date, refresh_token, user_id }: ICreateUserTokensDTO): Promise<UserTokens> {
		const userToken = new UserTokens();

		Object.assign(userToken, {
			expires_date,
			refresh_token,
			user_id
		});

		this.usersTokens.push(userToken);

		return userToken;
	}

	async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
		const userToken = this.usersTokens.find(
			userToken => userToken.user_id === user_id && userToken.refresh_token === refresh_token
		);

		return userToken;
	}

	async deleteById(id: string): Promise<void> {
		const userToken = this.usersTokens.find(ut => ut.id === id);

		this.usersTokens.splice(
			this.usersTokens.indexOf(userToken)
		);
	}

	async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
		return this.usersTokens.find(userToken => userToken.refresh_token === refresh_token);
	}

}

export { UserTokensRepositoryInMemory };
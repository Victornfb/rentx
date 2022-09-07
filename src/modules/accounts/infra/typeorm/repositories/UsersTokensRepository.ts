import { ICreateUserTokensDTO } from "@modules/accounts/dtos/ICreateUserTokensDTO";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { getRepository, Repository } from "typeorm";
import { UserTokens } from "../entities/UserTokens";

class UsersTokensRepository implements IUserTokensRepository {

	private repository: Repository<UserTokens>;

	constructor() {
		this.repository = getRepository(UserTokens);
	}

	async create({
		expires_date,
		refresh_token,
		user_id
	}: ICreateUserTokensDTO): Promise<UserTokens> {
		const userToken = this.repository.create({
			expires_date,
			refresh_token,
			user_id
		});

		await this.repository.save(userToken);

		return userToken;
	}

	async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
		const userToken = await this.repository.findOne({
			user_id,
			refresh_token,
		});

		return userToken;
	}

	async deleteById(id: string): Promise<void> {
		await this.repository.delete(id);
	}

	async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
		const userToken = await this.repository.findOne({
			refresh_token,
		});

		return userToken;
	}

}

export { UsersTokensRepository }
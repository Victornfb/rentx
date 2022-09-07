import { ICreateUserTokensDTO } from "../dtos/ICreateUserTokensDTO"
import { UserTokens } from "../infra/typeorm/entities/UserTokens"

interface IUserTokensRepository {
	create({expires_date, refresh_token, user_id }: ICreateUserTokensDTO): Promise<UserTokens>;
	findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens>;
	deleteById(id: string): Promise<void>;
	findByRefreshToken(refresh_token: string): Promise<UserTokens>;
}

export { IUserTokensRepository }
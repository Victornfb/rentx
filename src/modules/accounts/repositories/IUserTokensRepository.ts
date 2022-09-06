import { ICreateUserTokensDTO } from "../dtos/ICreateUserTokensDTO"
import { UserTokens } from "../infra/typeorm/entities/UserTokens"

interface IUserTokensRepository {
	create({expires_date, refresh_token, user_id }: ICreateUserTokensDTO): Promise<UserTokens>;
}

export { IUserTokensRepository }
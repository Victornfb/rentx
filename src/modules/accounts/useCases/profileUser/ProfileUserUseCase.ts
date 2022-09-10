import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserMap } from "@modules/accounts/mappers/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUserRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class ProfileUserUseCase {

	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository
	) {}

	async execute (id: string): Promise<IUserResponseDTO> {
		const user = await this.usersRepository.findById(id);

		if (!user) {
			throw new AppError('User does not exist');
		}

		return UserMap.toDTO(user);
	}

}

export { ProfileUserUseCase }
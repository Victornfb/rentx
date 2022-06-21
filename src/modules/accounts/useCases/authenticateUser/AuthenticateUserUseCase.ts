import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUserRepository";

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
}

@injectable()
class AuthenticateUserUseCase {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository
	) {}

	async execute({ email, password }: IRequest): Promise<IResponse> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new Error('Email or password incorrect');
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new Error('Email or password incorrect');
		}

		const token = sign({}, 'a286a8e8fe50b793a0134baabddc9a14', {
			subject: user.id,
			expiresIn: '1d',
		});

		const tokenReturn: IResponse = {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			token,
		};

		return tokenReturn;
	}
}

export { AuthenticateUserUseCase }
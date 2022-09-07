import { IUsersRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from 'uuid';

@injectable()
class SendForgotPasswordMailUseCase {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
		@inject('UsersTokensRepository')
		private usersTokensRepository: IUserTokensRepository,
		@inject('DayjsDateProvider')
		private dateProvider: IDateProvider,
		@inject('EtherealMailProvider')
		private mailProvider: IMailProvider
	) {}

	async execute(email: string): Promise<void> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			throw new AppError('User does not exist');
		}

		const token = uuidv4();

		await this.usersTokensRepository.create({
			refresh_token: token,
			user_id: user.id,
			expires_date: this.dateProvider.addHours(3),
		});

		await this.mailProvider.sendMail(
			email,
			'Rext - Recuperação de senha',
			`O link para recuperar a senha é ${token}`
		);
	}
}

export { SendForgotPasswordMailUseCase }
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Password Mail', () => {

	beforeEach(() => {
		usersRepositoryInMemory = new UsersRepositoryInMemory();
		dateProvider = new DayjsDateProvider();
		userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
		mailProvider = new MailProviderInMemory();

		sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
			usersRepositoryInMemory,
			userTokensRepositoryInMemory,
			dateProvider,
			mailProvider
		);
	});

	it('should be able to send a forgot password email', async () => {
		const sendMail = jest.spyOn(mailProvider, 'sendMail');

		await usersRepositoryInMemory.create({
			driver_license: '123456',
			email: 'test@example.com',
			name: 'Test Name',
			password: '9753',
		});

		await sendForgotPasswordMailUseCase.execute('test@example.com');

		expect(sendMail).toHaveBeenCalled();
	});

	it('should not be able to send a forgot password email if the user does not exist', async () => {
		await expect(
			sendForgotPasswordMailUseCase.execute('nonexisting@email.com')
		).rejects.toEqual(new AppError('User does not exist'));
	});

	it('should be able to create an user token', async () => {
		const generateToken = jest.spyOn(userTokensRepositoryInMemory, 'create');

		usersRepositoryInMemory.create({
			driver_license: '654321',
			email: 'example@email.com',
			name: 'Test Name',
			password: '2468',
		});

		await sendForgotPasswordMailUseCase.execute('example@email.com');

		expect(generateToken).toHaveBeenCalled();
	});

});
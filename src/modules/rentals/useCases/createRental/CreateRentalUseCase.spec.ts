import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "@modules/rentals/useCases/createRental/CreateRentalUseCase";
import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/providers/DateProvider/implementations/DayjsDateProvider";
import dayjs from "dayjs";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create rental', () => {
	const dateAdd24Hours = dayjs().add(24, 'hour').toDate();

	beforeEach(() => {
		rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
		createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsDateProvider);
	});

	it('should be able to create a new rental', async () => {
		const rental = await createRentalUseCase.execute({
			user_id: 'abc',
			car_id: 'xyz',
			expected_return_date: dateAdd24Hours,
		});

		expect(rental).toHaveProperty('id');
		expect(rental).toHaveProperty('start_date');
	});

	it('should not be able to create a new rental when the user has already a opened rental', async () => {
		expect(async () => {
			await createRentalUseCase.execute({
				user_id: 'abc',
				car_id: 'xyz',
				expected_return_date: dateAdd24Hours,
			});
	
			const rental = await createRentalUseCase.execute({
				user_id: 'abc',
				car_id: 'uvw',
				expected_return_date: dateAdd24Hours,
			});
		}).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create a new rental when the car has already a opened rental', async () => {
		expect(async () => {
			await createRentalUseCase.execute({
				user_id: 'abc',
				car_id: 'rst',
				expected_return_date: dateAdd24Hours,
			});
	
			const rental = await createRentalUseCase.execute({
				user_id: 'def',
				car_id: 'rst',
				expected_return_date: dateAdd24Hours,
			});
		}).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to create a new rental with invalid return date and time', async () => {
		expect(async () => {
			await createRentalUseCase.execute({
				user_id: 'abc',
				car_id: 'rst',
				expected_return_date: dayjs().toDate(),
			});
		}).rejects.toBeInstanceOf(AppError);
	});

})
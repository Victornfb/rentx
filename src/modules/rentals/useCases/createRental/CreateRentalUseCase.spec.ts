import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalUseCase } from "@modules/rentals/useCases/createRental/CreateRentalUseCase";
import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import dayjs from "dayjs";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Create rental', () => {
	const dateAdd24Hours = dayjs().add(24, 'hour').toDate();

	beforeEach(() => {
		rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
		carsRepositoryInMemory = new CarsRepositoryInMemory();
		dayjsDateProvider = new DayjsDateProvider();
		createRentalUseCase = new CreateRentalUseCase(
			rentalsRepositoryInMemory,
			dayjsDateProvider,
			carsRepositoryInMemory
		);
	});

	it('should be able to create a new rental', async () => {
		const car = await carsRepositoryInMemory.create({
			name: "Car test",
			description: "Car test description",
			daily_rate: 100,
			brand: "Brand test",
			category_id: "fake-category-id",
			fine_amount: 50,
			license_plate: "License plate test",
		});

		const rental = await createRentalUseCase.execute({
			user_id: 'abc',
			car_id: car.id,
			expected_return_date: dateAdd24Hours,
		});

		expect(rental).toHaveProperty('id');
		expect(rental).toHaveProperty('start_date');
	});

	it('should not be able to create a new rental when the user has already a opened rental', async () => {
		await rentalsRepositoryInMemory.create({
			car_id: 'fake-car-id',
			expected_return_date: dateAdd24Hours,
			user_id: 'fake-user-id',
		});

		await expect(
			createRentalUseCase.execute({
				user_id: 'fake-user-id',
				car_id: 'another-car-id',
				expected_return_date: dateAdd24Hours,
			})
		).rejects.toEqual(new AppError('The user already has a rental open'));
	});

	it('should not be able to create a new rental when the car has already a opened rental', async () => {
		await rentalsRepositoryInMemory.create({
			car_id: 'fake-car-id',
			expected_return_date: dateAdd24Hours,
			user_id: 'fake-user-id',
		});

		await expect(
			createRentalUseCase.execute({
				user_id: 'another-user-id',
				car_id: 'fake-car-id',
				expected_return_date: dateAdd24Hours,
			})
		).rejects.toEqual(new AppError('Car not available'));
	});

	it('should not be able to create a new rental with invalid return date and time', async () => {
		await expect(
			createRentalUseCase.execute({
				user_id: 'abc',
				car_id: 'rst',
				expected_return_date: dayjs().toDate(),
			})
		).rejects.toEqual(new AppError('Invalid return date and time.'));
	});

})
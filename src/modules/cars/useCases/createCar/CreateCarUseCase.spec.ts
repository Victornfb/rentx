import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase"

let carsRepositoryInMemory: CarsRepositoryInMemory;
let createCarUseCase: CreateCarUseCase;

describe('Create Car', () => {

	beforeEach(() => {
		carsRepositoryInMemory = new CarsRepositoryInMemory();
		createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
	});

	it('should be able to create a new car', async () => {
		const car = await createCarUseCase.execute({
			name: 'Fake Car',
			description: 'A fake car description',
			daily_rate: 100,
			license_plate: 'ABC1234',
			fine_amount: 60,
			brand: 'Fake Brand',
			category_id: 'category',
		});

		expect(car).toHaveProperty('id');
	});

	it('should not be able to create a car with a used license plate', async () => {
		expect(async () => {
			await createCarUseCase.execute({
				name: 'Fake Car 1',
				description: 'A new fake car description 1',
				daily_rate: 200,
				license_plate: 'ZXY9876',
				fine_amount: 120,
				brand: 'New Fake Brand 1',
				category_id: 'category',
			});

			await createCarUseCase.execute({
				name: 'Fake Car 2',
				description: 'A new fake car description 2',
				daily_rate: 300,
				license_plate: 'ZXY9876',
				fine_amount: 180,
				brand: 'New Fake Brand 2',
				category_id: 'category',
			});
		}).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to create a car with available as true by default', async () => {
		const car = await createCarUseCase.execute({
			name: 'Fake Car Available',
			description: 'A fake available car description',
			daily_rate: 100,
			license_plate: 'RST3579',
			fine_amount: 60,
			brand: 'Fake Brand',
			category_id: 'category',
		});

		expect(car.available).toBe(true);
	});
});
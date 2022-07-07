import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListCarsUseCase } from "./ListCarsUseCase";

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('List cars', () => {

	beforeEach(() => {
		carsRepositoryInMemory = new CarsRepositoryInMemory();
		listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
	});

	it('should be able to list all cars available', async () => {
		const car = await carsRepositoryInMemory.create({
			name: "Car 1",
			description: "Car description",
			daily_rate: 100,
			license_plate: "TES9999",
			fine_amount: 60,
			brand: "Car brand",
			category_id: "fake-category"
		});

		const cars = await listCarsUseCase.execute({});

		expect(cars).toEqual([car]);
	});

	it('should be able to list all cars available by name', async () => {
		const car = await carsRepositoryInMemory.create({
			name: "Car 2",
			description: "Car description",
			daily_rate: 100,
			license_plate: "TES9999",
			fine_amount: 60,
			brand: "Car brand",
			category_id: "fake-category"
		});

		const cars = await listCarsUseCase.execute({
			name: 'Car 2',
		});

		expect(cars).toEqual([car]);
	});

	it('should be able to list all cars available by brand', async () => {
		const car = await carsRepositoryInMemory.create({
			name: "Car 2",
			description: "Car description",
			daily_rate: 100,
			license_plate: "TES9999",
			fine_amount: 60,
			brand: "Car brand 2",
			category_id: "fake-category"
		});

		const cars = await listCarsUseCase.execute({
			brand: 'Car brand 2',
		});

		expect(cars).toEqual([car]);
	});

	it('should be able to list all cars available by category', async () => {
		const car = await carsRepositoryInMemory.create({
			name: "Car 2",
			description: "Car description",
			daily_rate: 100,
			license_plate: "TES9999",
			fine_amount: 60,
			brand: "Car brand 2",
			category_id: "fake-category-2"
		});

		const cars = await listCarsUseCase.execute({
			category_id: 'fake-category-2',
		});

		expect(cars).toEqual([car]);
	});

})
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationsRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {

	beforeEach(() => {
		carsRepositoryInMemory = new CarsRepositoryInMemory();
		specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
		createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
			carsRepositoryInMemory,
			specificationsRepositoryInMemory
		);
	})

	it('should be able to add a new specification to a car', async () => {
		const car = await carsRepositoryInMemory.create({
			name: 'Fake Car',
			description: 'A fake car description',
			daily_rate: 100,
			license_plate: 'ABC1234',
			fine_amount: 60,
			brand: 'Fake Brand',
			category_id: 'category',
		});

		const specification = await specificationsRepositoryInMemory.create({
			name: 'Specification test',
			description: 'Specification test description',
		});

		const specifications_id = [specification.id];

		const specificationsCars = await createCarSpecificationUseCase.execute({
			car_id: car.id,
			specifications_id,
		});

		expect(specificationsCars).toHaveProperty('specifications')
		expect(specificationsCars.specifications.length).toBe(1)
	})

	it('should not be able to add a specification to a non-existing car', async () => {
		const car_id = '12345';
		const specifications_id = ['67890'];

		await expect(
			createCarSpecificationUseCase.execute({ car_id, specifications_id })
		).rejects.toEqual(new AppError('Car does not exists'));
	})

});
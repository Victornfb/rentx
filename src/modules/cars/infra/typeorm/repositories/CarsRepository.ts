import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { getRepository, Repository } from "typeorm";

class CarsRepository implements ICarsRepository {
	private repository: Repository<Car>;

	constructor() {
		this.repository = getRepository(Car);
	}

	async create({
		name,
		description,
		daily_rate,
		license_plate,
		fine_amount,
		brand,
		category_id,
		specifications,
		id,
	}: ICreateCarDTO): Promise<Car> {
		const car = this.repository.create({
			name,
			description,
			daily_rate,
			license_plate,
			fine_amount,
			brand,
			category_id,
			specifications,
			id,
		});

		await this.repository.save(car);

		return car;
	}

	async findByLicensePlate(license_plate: string): Promise<Car> {
		const car = await this.repository.findOne({ license_plate });

		return car;
	}

	async findAllAvailable(brand?: string, category_id?: string, name?: string): Promise<Car[]> {
		const carsQuery = await this.repository
			.createQueryBuilder("cars")
			.where("available = :available", { available: true });

		if (brand) {
			carsQuery.andWhere("cars.brand = :brand", { brand: brand });
		}

		if (name) {
			carsQuery.andWhere("cars.name = :name", { name: name });
		}

		if (category_id) {
			carsQuery.andWhere("cars.category_id = :category_id", { category_id: category_id });
		}

		const cars = await carsQuery.getMany();

		return cars;
	}

	async findById(id: string): Promise<Car> {
		const car = await this.repository.findOne(id);
		return car;
	}

	async updateAvailable(id: string, available: boolean): Promise<void> {
		await this.repository
			.createQueryBuilder()
			.update()
			.set({available})
			.where("id = :id")
			.setParameters({id})
			.execute();
	}

}

export { CarsRepository };


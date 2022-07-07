import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

interface IRequest {
	brand?: string;
	category_id?: string;
	name?: string;
}

class ListCarsUseCase {
	constructor(
		private carsRepository: ICarsRepository
	) {}

	async execute({ brand, category_id, name }: IRequest): Promise<Car[]> {
		const cars = await this.carsRepository.findAllAvailable(brand, category_id, name);
		return cars;
	}
}

export { ListCarsUseCase };


import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

class RentalsRepository implements IRentalsRepository {
	private repository: Repository<Rental>;

	constructor() {
		this.repository = getRepository(Rental);
	}

	async create({
		car_id,
		expected_return_date,
		user_id,
	}: ICreateRentalDTO): Promise<Rental> {
		const rental = this.repository.create({
			car_id,
			expected_return_date,
			user_id,
		});

		await this.repository.save(rental);

		return rental;
	}

	async findOpenRentalByCarId(car_id: string): Promise<Rental> {
		return await this.repository.findOne({ car_id });
	}

	async findOpenRentalByUserId(user_id: string): Promise<Rental> {
		return await this.repository.findOne({ user_id });
	}

}

export { RentalsRepository };
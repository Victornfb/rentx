import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

interface IRentalsRepository {
	create(data: ICreateRentalDTO): Promise<Rental>;
	findOpenRentalByCarId(car_id: string): Promise<Rental>;
	findOpenRentalByUserId(user_id: string): Promise<Rental>;
	findById(id: string): Promise<Rental>;
}

export { IRentalsRepository };


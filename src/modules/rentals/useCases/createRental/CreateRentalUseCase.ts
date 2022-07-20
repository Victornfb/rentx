import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/providers/DateProvider/IDateProvider";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface IRequest {
	user_id: string;
	car_id: string;
	expected_return_date: Date;
}

class CreateRentalUseCase {
	constructor(
		private rentalsRepository: IRentalsRepository,
		private dateProvider: IDateProvider
	) {}
	async execute({user_id, car_id, expected_return_date}: IRequest): Promise<Rental> {
		const MINIMUM_RENT_HOURS = 24;
		const carUnavailable = await this.rentalsRepository.findOpenRentalByCarId(car_id);

		if (carUnavailable) {
			throw new AppError("Car not available");
		}

		const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUserId(user_id);

		if (rentalOpenToUser) {
			throw new AppError("The user already has a rental open");
		}

		const dateNow = this.dateProvider.dateNow();
		const compare = this.dateProvider.compareInHours(dateNow, expected_return_date);

		if (compare < MINIMUM_RENT_HOURS) {
			throw new AppError(`Invalid return date and time. Minimum of ${MINIMUM_RENT_HOURS} hours.`);
		}

		const rental = await this.rentalsRepository.create({
			user_id,
			car_id,
			expected_return_date,
		});

		return rental;
	}
}

export { CreateRentalUseCase };


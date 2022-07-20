import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/AppError";
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
		private rentalsRepository: IRentalsRepository
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

		const expectedReturnDateFormat = dayjs(expected_return_date).utc().local().format();
		const dateNow = dayjs(dayjs()).utc().local().format();

		const compare = dayjs(expectedReturnDateFormat).diff(dateNow, 'hours');

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


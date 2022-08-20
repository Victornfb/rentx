import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
	id: string;
	user_id: string;
}

@injectable()
class DevolutionRentalUseCase {

	constructor(
		@inject("RentalsRepository")
		private rentalsRepository: IRentalsRepository,
		@inject("CarsRepository")
		private carsRepository: ICarsRepository,
		@inject('DayjsDateProvider')
		private dateProvider: IDateProvider
	) {}

	async execute({ id, user_id }): Promise<Rental> {
		const MINIMUM_RENT_DAILIES = 1;
		const rental = await this.rentalsRepository.findById(id);
		const car = await this.carsRepository.findById(rental.car_id);

		if (!rental) {
			throw new AppError("Rental does not exist");
		}

		const dateNow = this.dateProvider.dateNow();

		let dailies = this.dateProvider.compareInDays(
			rental.start_date,
			dateNow
		);

		if (dailies < MINIMUM_RENT_DAILIES) {
			dailies = MINIMUM_RENT_DAILIES;
		}

		const delay = this.dateProvider.compareInDays(
			rental.expected_return_date,
			dateNow
		);

		let total = 0;

		if (delay > 0) {
			const calculateFine = delay * car.fine_amount;
			total += calculateFine;
		}

		total += dailies * car.daily_rate;

		rental.end_date = dateNow;
		rental.total = total;

		await this.rentalsRepository.create(rental);
		await this.carsRepository.updateAvailable(car.id, true);

		return rental;
	}

}

export { DevolutionRentalUseCase };
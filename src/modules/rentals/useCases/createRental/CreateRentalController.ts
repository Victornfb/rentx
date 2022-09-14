import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateRentalUseCase } from "@modules/rentals/useCases/createRental/CreateRentalUseCase";

class CreateRentalController {
	async handle(req: Request, res: Response): Promise<Response> {
		const { id } = req.user;
		const { expected_return_date, car_id } = req.body;
		const createRentalUseCase = container.resolve(CreateRentalUseCase);

		const rental = await createRentalUseCase.execute({
			car_id,
			expected_return_date,
			user_id: id,
		});

		return res.status(201).json(rental);
	}
}

export { CreateRentalController };
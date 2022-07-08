import { CarsImagesRepository } from "@modules/cars/infra/typeorm/repositories/CarsImagesRepository";
import { deleteFile } from "@utils/file";
import { inject, injectable } from "tsyringe";

interface IRequest {
	car_id: string;
	images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
	constructor(
		@inject('CarsImagesRepository')
		private carsImagesRepository: CarsImagesRepository
	) {}

	async execute({ car_id, images_name}: IRequest): Promise<void> {
		const carImages = await this.carsImagesRepository.findByCarId(car_id);

		carImages.map(async (image) => {
			await deleteFile(`./tmp/cars/${image.image_name}`);
		});

		await this.carsImagesRepository.deleteByCarId(car_id);

		images_name.map(async (image) => {
			await this.carsImagesRepository.create(car_id, image);
		});
	}
}

export { UploadCarImagesUseCase };


import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
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
		private carsImagesRepository: ICarsImagesRepository,
		@inject('StorageProvider')
		private storageProvider: IStorageProvider
	) {}

	async execute({ car_id, images_name}: IRequest): Promise<void> {
		const carImages = await this.carsImagesRepository.findByCarId(car_id);

		carImages.map(async (image) => {
			await this.storageProvider.delete(image.image_name, 'cars');
		});

		await this.carsImagesRepository.deleteByCarId(car_id);

		images_name.map(async (image) => {
			await this.carsImagesRepository.create(car_id, image);
			await this.storageProvider.save(image, 'cars');
		});
	}
}

export { UploadCarImagesUseCase };


import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";
import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { getRepository, Repository } from "typeorm";

class CarsImagesRepository implements ICarsImagesRepository {
	private repository: Repository<CarImage>;

	constructor() {
		this.repository = getRepository(CarImage);
	}

	async create(car_id: string, image_name: string): Promise<CarImage> {
		const carImage = this.repository.create({
			car_id,
			image_name,
		});

		await this.repository.save(carImage);

		return carImage;
	}

	async findByCarId(car_id: string): Promise<CarImage[]> {
		const carImages = await this.repository.find({
			where: {
				car_id
			}
		})
		return carImages;
	}

	async deleteByCarId(car_id: string): Promise<void> {
		await this.repository.delete({ car_id: car_id });
		return;
	}

}

export { CarsImagesRepository };


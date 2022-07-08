import { CarImage } from "@modules/cars/infra/typeorm/entities/CarImage";

interface ICarsImagesRepository {
	create(car_id: string, image_name: string): Promise<CarImage>;
	findByCarId(car_id: string): Promise<CarImage[]>;
	deleteByCarId(car_id: string): Promise<void>;
}

export { ICarsImagesRepository };


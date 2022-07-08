import { UploadCarImagesUseCase } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesUseCase";
import { Request, Response } from "express";
import { container } from "tsyringe";

interface IFile {
	filename: string;
}

class UploadCarImagesController {
	async handle(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;
		const images = req.files as IFile[];

		const uploadCarImagesUseCase = container.resolve(UploadCarImagesUseCase);

		const images_name = images.map(file => file.filename);

		await uploadCarImagesUseCase.execute({
			car_id: id,
			images_name,
		});

		return res.status(201).send();
	}
}

export { UploadCarImagesController };


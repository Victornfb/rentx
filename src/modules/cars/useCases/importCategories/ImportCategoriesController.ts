import { Request, Response } from "express";
import { ImportCategoriesUseCase } from "./ImportCategoriesUseCase";

class ImportCategoriesController {
	constructor(private importCategoriesUseCase: ImportCategoriesUseCase) {}

	handle(req: Request, res: Response): Response {
		const { file } = req;

		this.importCategoriesUseCase.execute(file);

		return res.send();
	}
}

export { ImportCategoriesController }
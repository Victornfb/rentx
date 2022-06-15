import { Router } from 'express';
import { CategoriesRepository } from '../modules/cars/repositories/implementations/CategoriesRepository';
import { createCategoryController } from '../modules/cars/useCases/createCategory';
import { listCategoriesController } from '../modules/cars/useCases/listCategories';

const categoriesRoutes = Router();

categoriesRoutes.post('/', (req, res) => {
	return createCategoryController.handle(req, res);
})

categoriesRoutes.get('/', (req, res) => {
	return listCategoriesController.handle(req, res);
})

export { categoriesRoutes };
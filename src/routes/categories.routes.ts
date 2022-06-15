import { Router } from 'express';
import multer from 'multer';

import { createCategoryController } from '../modules/cars/useCases/createCategory';
import { listCategoriesController } from '../modules/cars/useCases/listCategories';
import { importCategoriesController } from '../modules/cars/useCases/importCategories';

const categoriesRoutes = Router();

const upload = multer({
	dest: './tmp',
})

categoriesRoutes.post('/', (req, res) => {
	return createCategoryController.handle(req, res);
})

categoriesRoutes.get('/', (req, res) => {
	return listCategoriesController.handle(req, res);
})

categoriesRoutes.post('/import', upload.single('file'), (req, res) => {
	return importCategoriesController.handle(req, res);
})

export { categoriesRoutes };
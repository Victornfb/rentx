import { AppError } from "@shared/errors/AppError";
import { CategoriesRepositoryInMemory } from "@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

let createCategoryUseCase: CreateCategoryUseCase;
let categoriesRepositoryInMemory: CategoriesRepositoryInMemory;

describe('Create category', () => {

	beforeEach(() => {
		categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
		createCategoryUseCase = new CreateCategoryUseCase(categoriesRepositoryInMemory);
	})

	it('should be able to create a new category', async () => {
		const category = {
			name: 'Category test',
			description: 'Category description test',
		}

		await createCategoryUseCase.execute(category);

		const categoryCreated = await categoriesRepositoryInMemory.findByName(category.name);

		expect(categoryCreated).toHaveProperty('id');
	});

	it('should not be able to create a category with a used name', async () => {
		const category = {
			name: 'Category test',
			description: 'Category description test',
		}

		await createCategoryUseCase.execute(category);

		await expect(
			createCategoryUseCase.execute(category)
		).rejects.toEqual(new AppError('Category already exists'));
	});

})
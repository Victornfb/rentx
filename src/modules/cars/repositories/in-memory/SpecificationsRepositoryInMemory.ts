import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";
import { ICreateSpecificationDTO, ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";

class SpecificationsRepositoryInMemory implements ISpecificationsRepository {

	specification: Specification[] = [];

	async create({ name, description }: ICreateSpecificationDTO): Promise<Specification> {
		const specification = new Specification();

		Object.assign(specification, {
			name,
			description
		});

		this.specification.push(specification);

		return specification;
	}

	async findByName(name: string): Promise<Specification> {
		return this.specification.find(spec => spec.name === name);
	}

	async findByIds(ids: string[]): Promise<Specification[]> {
		const allSpecifications = await this.specification.filter(spec => ids.includes(spec.id));
		return allSpecifications;
	}

}

export { SpecificationsRepositoryInMemory };


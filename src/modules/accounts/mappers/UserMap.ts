import { instanceToInstance } from 'class-transformer';
import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { User } from "../infra/typeorm/entities/User";

class UserMap {

	static toDTO({
		id,
		email,
		name,
		avatar,
		driver_license,
		getAvatarUrl: avatar_url
	}: User): IUserResponseDTO {
		const user = instanceToInstance({
			id,
			email,
			name,
			avatar,
			driver_license,
			avatar_url
		});

		return user;
	}

}

export { UserMap };
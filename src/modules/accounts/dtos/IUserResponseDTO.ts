interface IUserResponseDTO {
	id: string;
	email: string;
	name: string;
	avatar: string;
	driver_license: string;
	avatar_url: () => string;
}

export { IUserResponseDTO }
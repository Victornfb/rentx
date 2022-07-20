interface IDateProvider {
	dateNow(): Date;
	compareInHours(startDate: Date, endDate: Date): number;
	convertToUTC(date: Date): string;
}

export { IDateProvider };
interface IDateProvider {
	dateNow(): Date;
	compareInHours(startDate: Date, endDate: Date): number;
	convertToUTC(date: Date): string;
	compareInDays(startDate: Date, endDate: Date): number;
}

export { IDateProvider };
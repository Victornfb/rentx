interface IDateProvider {
	dateNow(): Date;
	compareInHours(startDate: Date, endDate: Date): number;
	convertToUTC(date: Date): string;
	compareInDays(startDate: Date, endDate: Date): number;
	addDays(days: number): Date;
	addHours(hours: number): Date;
}

export { IDateProvider };
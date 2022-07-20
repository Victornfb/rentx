import dayjs from "dayjs";
import { IDateProvider } from "@shared/providers/DateProvider/IDateProvider";

class DayjsDateProvider implements IDateProvider {

	dateNow(): Date {
		return dayjs().toDate();
	}

	convertToUTC(date: Date): string {
		return dayjs(date)
			.utc()
			.local()
			.format();
	}

	compareInHours(startDate: Date, endDate: Date): number {
		const startDateUTC = this.convertToUTC(startDate);
		const endDateUTC = this.convertToUTC(endDate);

		return dayjs(endDateUTC).diff(startDateUTC, 'hours');
	}

}

export { DayjsDateProvider };
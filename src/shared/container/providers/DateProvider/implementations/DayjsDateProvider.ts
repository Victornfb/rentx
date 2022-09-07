import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

dayjs.extend(utc);

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

	compareInDays(startDate: Date, endDate: Date): number {
		const startDateUTC = this.convertToUTC(startDate);
		const endDateUTC = this.convertToUTC(endDate);

		return dayjs(endDateUTC).diff(startDateUTC, 'days');
	}

	addDays(days: number): Date {
		return dayjs().add(days, "days").toDate();
	}

	addHours(hours: number): Date {
		return dayjs().add(hours, "hours").toDate();
	}

	compareIfBefore(startDate: Date, endDate: Date): boolean {
		return dayjs(startDate).isBefore(endDate);
	}

}

export { DayjsDateProvider };
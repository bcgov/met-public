import dayjs from 'dayjs';
import { format, utcToZonedTime } from 'date-fns-tz';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatInTimeZone = (date: string, fmt: string, tz: string) =>
    format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export const formatDate = (d: string, formatString = 'yyyy-MM-dd') => {
    if (d) {
        return formatInTimeZone(d, formatString, 'UTC');
    } else {
        return ''; // empty date
    }
};

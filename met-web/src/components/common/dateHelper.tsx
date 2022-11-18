import dayjs from 'dayjs';
import { format, utcToZonedTime } from 'date-fns-tz';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from 'moment';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatInTimeZone = (date: string, fmt: string, tz: string) =>
    format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

export const formatDate = (date: string, formatString = 'yyyy-MM-dd') => {
    if (date) {
        return formatInTimeZone(date, formatString, 'PST');
    } else {
        return '';
    }
};

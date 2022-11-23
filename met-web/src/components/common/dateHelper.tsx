import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import moment from 'moment';

const formatToPSTTimeZone = (date: string, fmt: string, tz: string) =>
    format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

const formatToUTCTimeZone = (date: string, fmt: string, tz: string) =>
    moment(
        zonedTimeToUtc(date, tz).toISOString().substring(0, 10) +
            ' ' +
            zonedTimeToUtc(date, tz).toISOString().substring(11, 19),
    ).format(fmt);

export const formatDate = (date: string, formatString = 'yyyy-MM-dd') => {
    if (date) {
        return formatToPSTTimeZone(date.substring(0, 10) + 'T' + date.substring(11, 25) + 'Z', formatString, 'PST');
    } else {
        return '';
    }
};

export const formatToUTC = (date: string, formatString = 'yyyy-MM-dd') => {
    if (date) {
        const utcDate = formatToUTCTimeZone(date, formatString, 'PST');
        console.log(zonedTimeToUtc(date, 'PST').toISOString());
        console.log(utcDate);
        return utcDate.substring(0, 10) + ' ' + utcDate.substring(11, 25);
    } else {
        return '';
    }
};

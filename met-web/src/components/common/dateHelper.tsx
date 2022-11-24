import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import moment from 'moment';

const formatToPSTTimeZone = (date: Date, fmt: string, tz: string) =>
    format(utcToZonedTime(date, tz), fmt, { timeZone: tz });

const formatToUTCTimeZone = (date: Date, fmt: string, tz: string) =>
    moment(date.setHours(date.getHours() + zonedTimeToUtc(date, tz).getTimezoneOffset() / 60)).format(fmt);

export const formatDate = (date: string, formatString = 'yyyy-MM-dd') => {
    if (date) {
        return formatToPSTTimeZone(new Date(date + ' UTC'), formatString, 'PST');
    } else {
        return '';
    }
};

export const formatToUTC = (date: string, formatString = 'yyyy-MM-dd') => {
    if (date) {
        return formatToUTCTimeZone(new Date(date), formatString, 'PST');
    } else {
        return '';
    }
};

import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(tz);

const formatToPSTTimeZone = (date: string, fmt: string, tz: string) => dayjs.utc(date).tz(tz).format(fmt);

const formatToUTCTimeZone = (date: string, fmt: string) => dayjs(date).utc().format(fmt);

export const formatDate = (date: string, formatString = 'YYYY-MM-DD') => {
    if (date) {
        return formatToPSTTimeZone(date, formatString, 'America/Vancouver');
    } else {
        return '';
    }
};

export const formatToUTC = (date: Dayjs | string, formatString = 'YYYY-MM-DD HH:mm:ss') => {
    if (date) {
        return formatToUTCTimeZone(date.toString(), formatString);
    } else {
        return '';
    }
};

export const getDates = (date: string, timeFrom: Array<string>, timeTo: Array<string>) => {
    const dateFrom = dayjs(date).set('hour', Number(timeFrom[0])).set('minute', Number(timeFrom[1]));
    const dateTo = dayjs(date).set('hour', Number(timeTo[0])).set('minute', Number(timeTo[1]));

    return { dateFrom: dateFrom, dateTo: dateTo };
};

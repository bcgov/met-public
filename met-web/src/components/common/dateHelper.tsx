import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(tz);

const formatToPacificTimeZone = (date: string, fmt: string, tz: string) => dayjs.utc(date).tz(tz).format(fmt);

const formatToUTCTimeZone = (date: string, fmt: string) => dayjs(date).utc().format(fmt);

export const formatDate = (date: Dayjs | string, formatString = 'YYYY-MM-DD') => {
    if (date) {
        return formatToPacificTimeZone(date.toString(), formatString, 'US/Pacific');
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

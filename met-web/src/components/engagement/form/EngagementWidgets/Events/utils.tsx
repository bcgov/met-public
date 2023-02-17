import dayjs from 'dayjs';

export const getDates = (date: string, time_from: string, time_to: string) => {
    const time_from_split = time_from.split(':');
    const time_to_split = time_to.split(':');
    const dateFrom = dayjs(date).set('hour', Number(time_from_split[0])).set('minute', Number(time_from_split[1]));
    const dateTo = dayjs(date).set('hour', Number(time_to_split[0])).set('minute', Number(time_to_split[1]));

    return { dateFrom: dateFrom, dateTo: dateTo };
};

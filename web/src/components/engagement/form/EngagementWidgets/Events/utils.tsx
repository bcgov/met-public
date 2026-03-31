import dayjs from 'dayjs';

export const formEventDates = (date: string, time_from: string, time_to: string) => {
    //This function takes a date string from the event widget form and returns the date reformatted into two parts:
    //dateFrom represents the date the event begins, dateTo represents the date the event ends
    const time_from_split = time_from.split(':');
    const time_to_split = time_to.split(':');
    const dateFrom = dayjs(date).set('hour', Number(time_from_split[0])).set('minute', Number(time_from_split[1]));
    const dateTo = dayjs(date).set('hour', Number(time_to_split[0])).set('minute', Number(time_to_split[1]));

    return { dateFrom: dateFrom, dateTo: dateTo };
};

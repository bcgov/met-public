export interface UserResponseDetailByMonth {
    showdataby: string;
    responses: number;
}

export interface UserResponseDetailByWeek {
    showdataby: string;
    responses: number;
}

export const createDefaultByMonthData = (): UserResponseDetailByMonth => {
    return {
        showdataby: '',
        responses: 0,
    };
};

export const createDefaultByWeekData = (): UserResponseDetailByWeek => {
    return {
        showdataby: '',
        responses: 0,
    };
};

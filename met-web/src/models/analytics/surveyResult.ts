interface ResultData {
    value: string;
    count: number;
}

interface SurveyData {
    label: string;
    postion: number;
    result: ResultData[];
}

export interface SurveyResultData {
    data: SurveyData[];
}

export const createSurveyResultData = (): SurveyResultData => {
    return {
        data: [
            {
                label: '',
                postion: 0,
                result: [{ value: '', count: 0 }],
            },
        ],
    };
};

export const defaultData = [
    {
        label: '',
        postion: 0,
        result: [
            {
                value: '',
                count: 0,
            },
        ],
    },
];

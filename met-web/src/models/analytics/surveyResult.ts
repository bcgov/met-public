interface ResultData {
    value: string;
    count: number;
}

interface SurveyData {
    label: string;
    position: number;
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
                position: 0,
                result: [{ value: '', count: 0 }],
            },
        ],
    };
};

export const defaultData = [
    {
        label: '',
        position: 0,
        result: [
            {
                value: '',
                count: 0,
            },
        ],
    },
];

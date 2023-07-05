export interface SurveyBarData {
    label: string;
    position: number;
    result: {
        count: number;
        value: string;
    }[];
}

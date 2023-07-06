export interface SurveyReportSetting {
    id: number;
    survey_id: number;
    question_id: number;
    question_key: string;
    question_type: string;
    question_text: string;
    display: boolean;
}

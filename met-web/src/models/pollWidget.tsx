export interface PollWidget {
    id: number;
    engagement_id: number;
    widget_id: number;
    title: string;
    description: string;
    status: string;
    answers: PollAnswer[];
}
export interface PollAnswer {
    id: number;
    answer_text: string;
}
export interface PollResponse {
    selected_answer_id: string;
}

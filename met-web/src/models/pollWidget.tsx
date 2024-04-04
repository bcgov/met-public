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
    percentage?: number;
}
export interface PollResponse {
    selected_answer_id: string;
}

export interface PollResultResponse {
    answers: Array<{
        answer_id: number;
        answer_text: string;
        percentage: number;
        total_response: number;
    }>;
    description: string;
    poll_id: number;
    title: string;
    total_response: number;
}

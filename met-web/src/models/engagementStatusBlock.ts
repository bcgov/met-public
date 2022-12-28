export interface EngagementStatusBlock {
    survey_status: string;
    block_text: string;
}

export const createDefaultStatusBlock = (): EngagementStatusBlock => {
    return {
        survey_status: '',
        block_text: '',
    };
};

import { useState, useEffect } from 'react';
import { PollAnswer, PollWidget } from 'models/pollWidget';
import { Engagement } from 'models/engagement';
import { Widget } from 'models/widget';
import { EngagementStatus, PollStatus } from 'constants/engagementStatus';

const usePollWidgetState = (pollWidget: PollWidget | null, savedEngagement: Engagement, widget: Widget | null) => {
    const newAnswer = { id: 0, answer_text: '' };
    const initialWidgetState = {
        id: pollWidget?.id || 0,
        description: pollWidget?.description || '',
        title: pollWidget?.title || '',
        answers: pollWidget?.answers || [],
        status: pollWidget?.status || PollStatus.Active,
        widget_id: widget?.id || 0,
        engagement_id: widget?.engagement_id || 0,
    };

    const [pollAnswers, setPollAnswers] = useState<PollAnswer[]>(pollWidget ? pollWidget.answers : [newAnswer]);
    const [pollWidgetState, setPollWidgetState] = useState<PollWidget>(initialWidgetState);
    const [isEngagementPublished, setIsEngagementPublished] = useState(false);

    useEffect(() => {
        if (pollWidget) {
            setPollAnswers(pollWidget.answers);
            setPollWidgetState(pollWidget);
        }

        if (savedEngagement && savedEngagement.status_id === EngagementStatus.Published) {
            setIsEngagementPublished(true);
        }
    }, [pollWidget, savedEngagement]);

    return { pollAnswers, setPollAnswers, pollWidgetState, setPollWidgetState, isEngagementPublished };
};

export default usePollWidgetState;

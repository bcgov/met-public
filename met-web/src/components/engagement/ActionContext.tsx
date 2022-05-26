import React, { createContext, useState, useEffect } from "react";
import { postEngagement, putEngagement } from '../../services/EngagementService';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement } from '../../services/EngagementService';

interface EngagementContext {
    handleCreateEngagementRequest: Function;
    handleUpdateEngagementRequest: Function;
    saving: boolean;
    savedEngagement: Engagement;
    engagementId: string | undefined;
}
export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (engagement: any) => {},
    handleUpdateEngagementRequest: (engagement: any) => {},
    saving: false,
    savedEngagement: {
        id: 0,
        name: '',
        description: '',
        rich_text_state: '',
        status_id: '',
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
    },
    engagementId: 'create',
});

type EngagementParams = {
    engagementId: string;
};

export const ActionProvider = ({ children }: { children: any }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement>({
        id: 0,
        name: '',
        description: '',
        rich_text_state: '',
        status_id: '',
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
    });

    useEffect(() => {
        if (engagementId !== 'create' && isNaN(Number(engagementId))) {
            navigate('/engagement/create');
        }

        if (engagementId !== 'create') {
            getEngagement(Number(engagementId), (result: Engagement) => {
                setSavedEngagement({ ...result });
            });
        }
    }, [engagementId]);

    const handleCreateEngagementRequest = (engagement: any) => {
        setSaving(true);
        postEngagement(
            {
                name: engagement.name,
                start_date: engagement.fromDate,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_text_state: engagement.rawEditorState,
            },
            () => {
                setSaving(false);
                navigate('/');
            },
            (errorMessage: string) => {
                setSaving(false);
                //TODO: Error message in notification module
                console.log(errorMessage);
            },
        );
    };

    const handleUpdateEngagementRequest = (engagement: any) => {
        setSaving(true);
        putEngagement(
            {
                id: engagementId,
                name: engagement.name,
                start_date: engagement.fromDate,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_text_state: engagement.rawEditorState,
            },
            () => {
                setSaving(false);
                navigate('/');
            },
            (errorMessage: string) => {
                setSaving(false);
                //TODO: Error message in notification module
                console.log(errorMessage);
            },
        );
    };

    return (
        <ActionContext.Provider
            value={{
                handleCreateEngagementRequest,
                handleUpdateEngagementRequest,
                saving,
                savedEngagement,
                engagementId,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

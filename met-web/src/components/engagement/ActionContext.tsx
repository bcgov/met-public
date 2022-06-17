import React, { createContext, useState, useEffect } from 'react';
import { postEngagement, putEngagement, getEngagement } from '../../services/engagementService';
import { useNavigate, useParams } from 'react-router-dom';
import { EngagementContext, EngagementForm, EngagementParams } from './types';
import { Engagement } from '../../models/engagement';

export const ActionContext = createContext<EngagementContext>({
    handleCreateEngagementRequest: (_engagement: EngagementForm) => {
        /* empty default method  */
    },
    handleUpdateEngagementRequest: (_engagement: EngagementForm) => {
        /* empty default method  */
    },
    saving: false,
    savedEngagement: {
        id: 0,
        name: '',
        description: '',
        rich_description: '',
        status_id: '',
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
    },
    engagementId: 'create',
    loadingSavedEngagement: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [loadingSavedEngagement, setLoadingSavedEngagement] = useState(true);

    const [savedEngagement, setSavedEngagement] = useState<Engagement>({
        id: 0,
        name: '',
        description: '',
        rich_description: '',
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
            setLoadingSavedEngagement(true);
            getEngagement(
                Number(engagementId),
                (result: Engagement) => {
                    setSavedEngagement({ ...result });
                    setLoadingSavedEngagement(false);
                },
                (errorMessage: string) => {
                    //TODO engagement created success message in notification module
                    console.log(errorMessage);
                    navigate('/');
                },
            );
        } else {
            setLoadingSavedEngagement(false);
        }
    }, [engagementId]);

    const handleCreateEngagementRequest = (engagement: EngagementForm) => {
        setSaving(true);
        postEngagement(
            {
                name: engagement.name,
                start_date: engagement.fromDate,
                status_id: engagement.status_id,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_description: engagement.richDescription,
            },
            () => {
                //TODO engagement created success message in notification module
                setSaving(false);
                navigate('/');
            },
            (errorMessage: string) => {
                //TODO:engagement create error message in notification module
                setSaving(false);
                console.log(errorMessage);
            },
        );
    };

    const handleUpdateEngagementRequest = (engagement: EngagementForm) => {
        setSaving(true);
        putEngagement(
            {
                id: Number(engagementId),
                name: engagement.name,
                start_date: engagement.fromDate,
                status_id: engagement.status_id,
                end_date: engagement.toDate,
                description: engagement.description,
                rich_description: engagement.richDescription,
            },
            () => {
                //TODO engagement update success message in notification module
                setSaving(false);
                navigate('/');
            },
            (errorMessage: string) => {
                //TODO: engagement update error message in notification module
                setSaving(false);
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
                loadingSavedEngagement,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

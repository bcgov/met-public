import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEngagement } from '../../../services/engagementService';
import { Engagement } from '../../../models/engagement';

export interface EngagementViewContext {
    savedEngagement: Engagement;
    engagementLoading: boolean;
}

export type EngagementParams = {
    engagementId: string;
};

export const ActionContext = createContext<EngagementViewContext>({
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
        banner_image_link: '',
        content: '',
        rich_content: '',
    },
    engagementLoading: true,
});

export const ActionProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();

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
        banner_image_link: '',
        content: '',
        rich_content: '',
    });
    const [engagementLoading, setEngagementLoading] = useState(true);

    useEffect(() => {
        if (isNaN(Number(engagementId))) {
            navigate('/');
            return;
        }
        getEngagement(
            Number(engagementId),
            (result: Engagement) => {
                setSavedEngagement({ ...result });
                setEngagementLoading(false);
            },
            (errorMessage: string) => {
                //TODO engagement created success message in notification module
                console.log(errorMessage);
                navigate('/');
            },
        );
    }, [engagementId]);

    return (
        <ActionContext.Provider
            value={{
                savedEngagement,
                engagementLoading,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

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
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        status: { status_name: '' },
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
        status_id: 0,
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
        banner_url: '',
        banner_filename: '',
        content: '',
        rich_content: '',
        status: { status_name: '' },
    });
    const [engagementLoading, setEngagementLoading] = useState(true);

    useEffect(() => {
        const fetchEngagement = async () => {
            if (isNaN(Number(engagementId))) {
                navigate('/');
                return;
            }
            try {
                const result = await getEngagement(Number(engagementId));
                setSavedEngagement({ ...result });
                setEngagementLoading(false);
            } catch (error) {
                //TODO engagement created success message in notification module
                console.log(error);
                navigate('/');
            }
        };
        fetchEngagement();
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

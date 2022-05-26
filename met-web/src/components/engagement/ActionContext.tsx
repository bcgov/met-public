import React, { createContext, useState, useEffect } from "react";
import { postEngagement } from "../../services/EngagementService";
import { useNavigate, useParams } from "react-router-dom";
import { getEngagement } from "../../services/EngagementService";

interface EngagementContext {
    rawEditorState: any;
    handleEditorStateChange: any;
    handleSaveEngagement: any;
    saving: boolean;
    savedEngagement: Engagement;
}
export const ActionContext = createContext<EngagementContext>({
    rawEditorState: {},
    handleEditorStateChange: (newState: any) => {},
    handleSaveEngagement: (engagement: any) => {},
    saving: false,
    savedEngagement: {
        id: 0,
        name: '',
        description: '',
        status_id: '',
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
    },
});

type EngagementParams = {
    engagementId: string;
};

export const ActionProvider = ({ children }: { children: any }) => {
    const { engagementId } = useParams<EngagementParams>();
    const navigate = useNavigate();

    //should be saved in DB and given to Rich Text Editor for update engagement operation
    const [rawEditorState, setRawEditorState] = useState(null);
    const [saving, setSaving] = useState(false);
    const [savedEngagement, setSavedEngagement] = useState<Engagement>({
        id: 0,
        name: '',
        description: '',
        status_id: '',
        start_date: '',
        end_date: '',
        published_date: '',
        user_id: '',
        created_date: '',
        updated_date: '',
    });

    useEffect(() => {
        if (engagementId !== 'create') {
            getEngagement(Number(engagementId), (result: Engagement) => {
                console.log('result', result);
                setSavedEngagement({ ...result });
            });
        }
    }, [engagementId]);

    const handleEditorStateChange = (newState: any) => {
        setRawEditorState(newState);
    };

    const handleSaveEngagement = async (engagement: any) => {
        setSaving(true);
        const response = await postEngagement({
            name: engagement.name,
            start_date: engagement.fromDate,
            end_date: engagement.toDate,
            description: engagement.description,
        });
        setSaving(false);
        if (response.status) {
            navigate('/');
        }
    };

    return (
        <ActionContext.Provider
            value={{
                rawEditorState,
                handleEditorStateChange,
                handleSaveEngagement,
                saving,
                savedEngagement,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

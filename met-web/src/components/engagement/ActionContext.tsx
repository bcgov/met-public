import React, { createContext, useState } from 'react';
import { postEngagement } from '../../services/EngagementService';
import { useNavigate } from 'react-router-dom';

interface EngagementContext {
    rawEditorState: any;
    handleEditorStateChange: any;
    saveEngagement: any;
    saving: boolean;
}

export const ActionContext = createContext<EngagementContext>({
    rawEditorState: {},
    handleEditorStateChange: (_newState: any) => {
        // Empty method
    },
    saveEngagement: (_engagement: any) => {
        // Empty method
    },
    saving: false,
});

export const ActionProvider = ({ children }: { children: any }) => {
    const navigate = useNavigate();

    //should be saved in DB and given to Rich Text Editor for update engagement operation
    const [rawEditorState, setRawEditorState] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleEditorStateChange = (_newState: any) => {
        setRawEditorState(_newState);
    };

    const saveEngagements = async (_engagement: any) => {
        setSaving(true);
        const response = await postEngagement({
            name: _engagement.name,
            start_date: _engagement.fromDate,
            end_date: _engagement.toDate,
            description: _engagement.description,
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
                saveEngagement: saveEngagements,
                saving,
            }}
        >
            {children}
        </ActionContext.Provider>
    );
};

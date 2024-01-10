import React, { createContext, useContext, useEffect, useState } from 'react';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { User } from 'models/user';
import { ActionContext } from '../ActionContext';
import { EngagementTeamMember } from 'models/engagementTeamMember';
import { getTeamMembers } from 'services/membershipService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { EngagementSettings, createDefaultEngagementSettings } from 'models/engagement';
import { updatedDiff } from 'deep-object-diff';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import {
    PatchEngagementSettingsRequest,
    getEngagementSettings,
    patchEngagementSettings,
} from 'services/engagementSettingService';

interface EngagementFormData {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    content: string;
    is_internal: boolean;
    consent_message: string;
}

interface EngagementSettingsFormData {
    send_report: boolean;
}

const initialEngagementFormData = {
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    content: '',
    is_internal: false,
    consent_message: '',
};

interface EngagementFormError {
    name: boolean;
    start_date: boolean;
    end_date: boolean;
    description: boolean;
}

const initialFormError = {
    name: false,
    start_date: false,
    end_date: false,
    description: false,
};

export interface EngagementTabsContextState {
    engagementFormData: EngagementFormData;
    setEngagementFormData: React.Dispatch<React.SetStateAction<EngagementFormData>>;
    richDescription: string;
    setRichDescription: React.Dispatch<React.SetStateAction<string>>;
    richContent: string;
    setRichContent: React.Dispatch<React.SetStateAction<string>>;
    engagementFormError: EngagementFormError;
    setEngagementFormError: React.Dispatch<React.SetStateAction<EngagementFormError>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    surveyBlockText: { [key in SubmissionStatusTypes]: string };
    setSurveyBlockText: React.Dispatch<React.SetStateAction<{ [key in SubmissionStatusTypes]: string }>>;
    addTeamMemberOpen: boolean;
    setAddTeamMemberOpen: React.Dispatch<React.SetStateAction<boolean>>;
    teamMembers: EngagementTeamMember[];
    setTeamMembers: React.Dispatch<React.SetStateAction<EngagementTeamMember[]>>;
    teamMembersLoading: boolean;
    loadTeamMembers: () => void;
    settings: EngagementSettings;
    settingsLoading: boolean;
    updateEngagementSettings: (settingsForm: EngagementSettingsFormData) => Promise<void>;
    savedSlug: string;
    setSavedSlug: React.Dispatch<React.SetStateAction<string>>;
}

export const EngagementTabsContext = createContext<EngagementTabsContextState>({
    engagementFormData: initialEngagementFormData,
    setEngagementFormData: () => {
        throw new Error('setEngagementFormData is unimplemented');
    },
    richDescription: '',
    setRichDescription: () => {
        throw new Error('setRichDescription is unimplemented');
    },
    richContent: '',
    setRichContent: () => {
        throw new Error('setRichContent is unimplemented');
    },
    engagementFormError: initialFormError,
    setEngagementFormError: () => {
        throw new Error('setEngagementFormError is unimplemented');
    },
    surveyBlockText: {
        Upcoming: '',
        Open: '',
        Closed: '',
    },
    setSurveyBlockText: () => {
        throw new Error('setSurveyBlockText not implemented');
    },
    users: [],
    setUsers: () => {
        throw new Error('setUsers is unimplemented');
    },
    addTeamMemberOpen: false,
    setAddTeamMemberOpen: () => {
        throw new Error('Set team member open not implemented');
    },
    teamMembers: [],
    setTeamMembers: () => {
        throw new Error('Set team members not implemented');
    },
    teamMembersLoading: false,
    loadTeamMembers: () => {
        throw new Error('Load team members not implemented');
    },
    settings: createDefaultEngagementSettings(),
    settingsLoading: false,
    updateEngagementSettings: () => {
        throw new Error('updateEngagementSettings not implemented');
    },
    savedSlug: '',
    setSavedSlug: () => {
        throw new Error('setSavedSlug not implemented');
    },
});

export const EngagementTabsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { savedEngagement, engagementMetadata } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [engagementFormData, setEngagementFormData] = useState<EngagementFormData>({
        name: savedEngagement.name || '',
        start_date: savedEngagement.start_date,
        end_date: savedEngagement.end_date,
        description: savedEngagement.description || '',
        content: savedEngagement.content || '',
        is_internal: savedEngagement.is_internal || false,
        consent_message: savedEngagement.consent_message || '',
    });
    const [richDescription, setRichDescription] = useState(savedEngagement?.rich_description || '');
    const [richContent, setRichContent] = useState(savedEngagement?.rich_content || '');
    const [engagementFormError, setEngagementFormError] = useState<EngagementFormError>(initialFormError);

    // Survey block
    const [surveyBlockText, setSurveyBlockText] = useState<{ [key in SubmissionStatusTypes]: string }>({
        Upcoming:
            savedEngagement.status_block.find((block) => block.survey_status === SUBMISSION_STATUS.UPCOMING)
                ?.block_text || '',
        Open:
            savedEngagement.status_block.find((block) => block.survey_status === SUBMISSION_STATUS.OPEN)?.block_text ||
            '',
        Closed:
            savedEngagement.status_block.find((block) => block.survey_status === SUBMISSION_STATUS.CLOSED)
                ?.block_text || '',
    });

    // User listing
    const [users, setUsers] = useState<User[]>([]);
    const [teamMembers, setTeamMembers] = useState<EngagementTeamMember[]>([]);
    const [addTeamMemberOpen, setAddTeamMemberOpen] = useState(false);
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);

    const loadTeamMembers = async () => {
        try {
            setTeamMembersLoading(true);
            const response = await getTeamMembers({ engagement_id: savedEngagement.id });
            setTeamMembers(response);
            setTeamMembersLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch users, please refresh the page or try again at a later time',
                }),
            );
            setTeamMembersLoading(false);
        }
    };

    useEffect(() => {
        if (savedEngagement.id) {
            loadTeamMembers();
        }
    }, [savedEngagement]);

    const [settings, setSettings] = useState<EngagementSettings>(createDefaultEngagementSettings());
    const [settingsLoading, setSettingsLoading] = useState(true);

    const loadSettings = async () => {
        try {
            setSettingsLoading(true);
            const response = await getEngagementSettings(savedEngagement.id);
            setSettings(response);
            setSettingsLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch settings, please refresh the page or try again at a later time',
                }),
            );
            setSettingsLoading(false);
        }
    };

    useEffect(() => {
        if (savedEngagement.id) {
            loadSettings();
        }
    }, [savedEngagement]);

    const updateEngagementSettings = async (settingsForm: EngagementSettingsFormData) => {
        try {
            const updatedSettings = updatedDiff(
                {
                    send_report: settings.send_report,
                },
                settingsForm,
            ) as PatchEngagementSettingsRequest;

            if (Object.keys(updatedSettings).length === 0) {
                return Promise.resolve();
            }
            await patchEngagementSettings({
                ...updatedSettings,
                engagement_id: savedEngagement.id,
            });
            await loadSettings();
            return Promise.resolve();
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to update settings, please refresh the page or try again at a later time',
                }),
            );
        }
    };

    const [savedSlug, setSavedSlug] = useState('');

    const handleGetSlug = async () => {
        if (!savedEngagement.id) return;

        try {
            const response = await getSlugByEngagementId(savedEngagement.id);
            setSavedSlug(response.slug);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Failed to get slug',
                }),
            );
        }
    };

    useEffect(() => {
        handleGetSlug();
    }, [savedEngagement.id]);

    return (
        <EngagementTabsContext.Provider
            value={{
                engagementFormData,
                setEngagementFormData,
                richDescription,
                setRichDescription,
                richContent,
                setRichContent,
                engagementFormError,
                setEngagementFormError,
                setSurveyBlockText,
                surveyBlockText,
                users,
                setUsers,
                addTeamMemberOpen,
                setAddTeamMemberOpen,
                teamMembers,
                setTeamMembers,
                teamMembersLoading,
                loadTeamMembers,
                settings,
                settingsLoading,
                updateEngagementSettings,
                savedSlug,
                setSavedSlug,
            }}
        >
            {children}
        </EngagementTabsContext.Provider>
    );
};

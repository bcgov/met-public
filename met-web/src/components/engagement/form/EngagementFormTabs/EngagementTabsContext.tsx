import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { EngagementSlugPatchRequest, patchEngagementSlug } from 'services/engagementSlugService';
import { EngagementForm } from '../types';
import { SubmissionStatus } from 'constants/engagementStatus';

interface EngagementFormData {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    description_title: string;
    content: string;
    is_internal: boolean;
    consent_message: string;
    sponsor_name: string;
}

interface EngagementSettingsFormData {
    send_report: boolean;
}

interface EngagementSettingsSlugData {
    slug: string;
}

const initialEngagementFormData = {
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    description_title: '',
    content: '',
    is_internal: false,
    consent_message: '',
    sponsor_name: '',
};

const initialEngagementSettingsFormData = {
    send_report: false,
};

const initialEngagementSettingsSlugData = {
    slug: '',
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
    metadataFormRef: React.RefObject<HTMLFormElement | null> | null;
    handleSaveAndContinueEngagement: () => Promise<void | EngagementForm>;
    handlePreviewEngagement: () => Promise<void>;
    handleSaveAndExitEngagement: () => Promise<void>;
    richDescription: string;
    setRichDescription: React.Dispatch<React.SetStateAction<string>>;
    richContent: string;
    setRichContent: React.Dispatch<React.SetStateAction<string>>;
    richConsentMessage: string;
    setRichConsentMessage: React.Dispatch<React.SetStateAction<string>>;
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
    sendReport: EngagementSettingsFormData;
    setSendReport: React.Dispatch<React.SetStateAction<EngagementSettingsFormData>>;
    settingsLoading: boolean;
    savedSlug: string;
    hasBeenOpened: boolean;
    slug: EngagementSettingsSlugData;
    setSlug: React.Dispatch<React.SetStateAction<EngagementSettingsSlugData>>;
    customTextContent: string;
    setCustomTextContent: React.Dispatch<React.SetStateAction<string>>;
    customJsonContent: string;
    setCustomJsonContent: React.Dispatch<React.SetStateAction<string>>;
}

export const EngagementTabsContext = createContext<EngagementTabsContextState>({
    engagementFormData: initialEngagementFormData,
    setEngagementFormData: () => {
        throw new Error('setEngagementFormData is unimplemented');
    },
    metadataFormRef: null,
    handleSaveAndContinueEngagement: async () => {
        /* empty default method for engagement save and continue */
    },
    handlePreviewEngagement: async () => {
        /* empty default method for engagement preview  */
    },
    handleSaveAndExitEngagement: async () => {
        /* empty default method for engagement save and continue  */
    },
    richDescription: '',
    setRichDescription: () => {
        throw new Error('setRichDescription is unimplemented');
    },
    richConsentMessage: '',
    setRichConsentMessage: () => {
        /* empty default method  */
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
        ViewResults: '',
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
    sendReport: initialEngagementSettingsFormData,
    setSendReport: () => {
        /* empty default method  */
    },
    settingsLoading: false,
    savedSlug: '',
    hasBeenOpened: false,
    slug: initialEngagementSettingsSlugData,
    setSlug: () => {
        /* empty default method  */
    },
    customTextContent: '',
    setCustomTextContent: () => {
        /* empty default method  */
    },
    customJsonContent: '',
    setCustomJsonContent: () => {
        /* empty default method  */
    },
});

export const EngagementTabsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const {
        setSaving,
        handleCreateEngagementRequest,
        handleUpdateEngagementRequest,
        savedEngagement,
        isNewEngagement,
    } = useContext(ActionContext);
    const dispatch = useAppDispatch();
    const [engagementFormData, setEngagementFormData] = useState<EngagementFormData>({
        name: savedEngagement.name || '',
        start_date: savedEngagement.start_date,
        end_date: savedEngagement.end_date,
        description: savedEngagement.description || '',
        description_title: savedEngagement.description_title || '',
        content: savedEngagement.content || '',
        is_internal: savedEngagement.is_internal || false,
        consent_message: savedEngagement.consent_message || '',
        sponsor_name: savedEngagement.sponsor_name,
    });
    const [richDescription, setRichDescription] = useState(savedEngagement?.rich_description || '');
    const [richContent, setRichContent] = useState('');
    const [richConsentMessage, setRichConsentMessage] = useState(savedEngagement?.consent_message || '');
    const [customTextContent, setCustomTextContent] = useState('');
    const [customJsonContent, setCustomJsonContent] = useState('');
    const [engagementFormError, setEngagementFormError] = useState<EngagementFormError>(initialFormError);
    const metadataFormRef = useRef<HTMLFormElement>(null);

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
        ViewResults:
            savedEngagement.status_block.find((block) => block.survey_status === SUBMISSION_STATUS.VIEW_RESULTS)
                ?.block_text || '',
    });

    // User listing
    const [users, setUsers] = useState<User[]>([]);
    const [teamMembers, setTeamMembers] = useState<EngagementTeamMember[]>([]);
    const [addTeamMemberOpen, setAddTeamMemberOpen] = useState(false);
    const [teamMembersLoading, setTeamMembersLoading] = useState(false);

    useEffect(() => {
        if (savedEngagement.id) {
            setEngagementFormData({
                name: savedEngagement.name || '',
                start_date: savedEngagement.start_date,
                end_date: savedEngagement.end_date,
                description: savedEngagement.description || '',
                description_title: savedEngagement.description_title || '',
                content: savedEngagement.content || '',
                is_internal: savedEngagement.is_internal || false,
                consent_message: savedEngagement.consent_message || '',
                sponsor_name: savedEngagement.sponsor_name,
            });
            setRichDescription(savedEngagement?.rich_description || '');
            setRichConsentMessage(savedEngagement?.consent_message || '');
            setRichContent(savedEngagement?.rich_content || '');
        }
    }, [savedEngagement]);

    const loadTeamMembers = async () => {
        try {
            setTeamMembersLoading(true);
            const response = await getTeamMembers({ engagement_id: savedEngagement.id });
            setTeamMembers(response);
            setTeamMembersLoading(false);
        } catch {
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
    const [sendReport, setSendReport] = useState<EngagementSettingsFormData>({
        send_report: false,
    });
    const [settingsLoading, setSettingsLoading] = useState(true);

    const loadSettings = async () => {
        try {
            setSettingsLoading(true);
            const response = await getEngagementSettings(savedEngagement.id);
            setSettings(response);
            setSendReport({ send_report: response.send_report });
            setSettingsLoading(false);
        } catch {
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
        setSaving(true);
        try {
            const updatedSettings = updatedDiff(
                {
                    send_report: settings.send_report,
                },
                settingsForm,
            ) as PatchEngagementSettingsRequest;

            if (Object.keys(updatedSettings).length === 0) {
                setSaving(false);
                return;
            }
            await patchEngagementSettings({
                ...updatedSettings,
                engagement_id: savedEngagement.id,
            });
            await loadSettings();
            dispatch(openNotification({ severity: 'success', text: 'Engagement has been saved' }));
            setSaving(false);
            return;
        } catch {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to update settings, please refresh the page or try again at a later time',
                }),
            );
            setSaving(false);
        }
    };

    const [savedSlug, setSavedSlug] = useState('');
    const [slug, setSlug] = useState<EngagementSettingsSlugData>(initialEngagementSettingsSlugData);

    const handleGetSlug = async () => {
        if (!savedEngagement.id) return;

        try {
            const response = await getSlugByEngagementId(savedEngagement.id);
            setSavedSlug(response.slug);
            setSlug({ slug: response.slug });
        } catch {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Failed to get slug',
                }),
            );
        }
    };

    const handleSaveSlug = async (slug: EngagementSettingsSlugData) => {
        setSaving(true);
        try {
            const updatedSlug = updatedDiff(
                {
                    slug: savedSlug,
                },
                slug,
            ) as EngagementSlugPatchRequest;

            if (Object.keys(updatedSlug).length === 0) {
                setSaving(false);
                return;
            }

            const response = await patchEngagementSlug({
                ...updatedSlug,
                engagement_id: savedEngagement.id,
            });
            setSavedSlug(response.slug);
            dispatch(openNotification({ severity: 'success', text: 'Engagement has been saved' }));
            setSaving(false);
            return;
        } catch {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Failed to update engagement link',
                }),
            );
            setSaving(false);
        }
    };

    const { name, start_date, end_date, description } = engagementFormData;
    const surveyBlockList = [
        {
            survey_status: SUBMISSION_STATUS.UPCOMING,
            block_text: surveyBlockText.Upcoming,
            link_type: 'none',
        },
        {
            survey_status: SUBMISSION_STATUS.OPEN,
            block_text: surveyBlockText.Open,
            button_text: 'Provide Feedback',
            link_type: 'internal',
            internal_link: 'provideFeedback',
        },
        {
            survey_status: SUBMISSION_STATUS.CLOSED,
            block_text: surveyBlockText.Closed,
            link_type: 'none',
        },
        {
            survey_status: SUBMISSION_STATUS.VIEW_RESULTS,
            block_text: '',
            link_type: 'internal',
            internal_link: 'provideFeedback',
            button_text: 'View Results',
        },
    ];
    const validateForm = () => {
        const errors = {
            name: !(name && name.length < 50),
            start_date: !start_date,
            end_date: !end_date,
            description: description.length > 550,
        };
        setEngagementFormError(errors);

        return Object.values(errors).some((isError: unknown) => isError);
    };

    const handleSaveEngagementMetadata = async () => {
        setSaving(true);
        const result = await metadataFormRef.current?.submitForm();
        if (metadataFormRef.current && !result) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error saving metadata: Please correct the highlighted fields and try again.',
                }),
            );
        }
        if (metadataFormRef.current && result) {
            dispatch(openNotification({ severity: 'success', text: 'Engagement has been saved' }));
        }
        setSaving(false);
        return result;
    };

    const handleSaveAndContinueEngagement = async () => {
        const hasErrors = validateForm();

        if (hasErrors) {
            return;
        }

        const engagement = isNewEngagement
            ? await handleCreateEngagementRequest({
                  ...engagementFormData,
                  rich_description: richDescription,
                  rich_content: richContent,
                  status_block: surveyBlockList,
              })
            : await handleUpdateEngagementRequest({
                  ...engagementFormData,
                  rich_description: richDescription,
                  status_block: surveyBlockList,
              });

        if (!isNewEngagement) {
            await updateEngagementSettings(sendReport);
            await handleSaveSlug(slug);
            await handleSaveEngagementMetadata();
        }
        return engagement;
    };

    const navigate = useNavigate();
    const handlePreviewEngagement = async () => {
        const engagement = await handleSaveAndContinueEngagement();
        if (!engagement) {
            return;
        }

        navigate(`/engagements/${engagement.id}/view`);
    };

    const handleSaveAndExitEngagement = async () => {
        const engagement = await handleSaveAndContinueEngagement();
        if (!engagement) {
            return;
        }

        navigate(`/engagements`);
    };

    useEffect(() => {
        handleGetSlug();
    }, [savedEngagement.id]);

    const hasBeenOpened = [SubmissionStatus.Closed, SubmissionStatus.Open].includes(
        savedEngagement.engagement_status.id,
    );

    return (
        <EngagementTabsContext.Provider
            value={{
                engagementFormData,
                setEngagementFormData,
                metadataFormRef,
                handleSaveAndContinueEngagement,
                handlePreviewEngagement,
                handleSaveAndExitEngagement,
                richDescription,
                setRichDescription,
                richContent,
                setRichContent,
                richConsentMessage,
                setRichConsentMessage,
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
                sendReport,
                setSendReport,
                settingsLoading,
                savedSlug,
                hasBeenOpened,
                slug,
                setSlug,
                customTextContent,
                setCustomTextContent,
                customJsonContent,
                setCustomJsonContent,
            }}
        >
            {children}
        </EngagementTabsContext.Provider>
    );
};

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { User } from 'models/user';
import { ActionContext } from '../ActionContext';
import { EngagementTeamMember } from 'models/engagementTeamMember';
import { getTeamMembers } from 'services/membershipService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import {
    EngagementMetadata,
    EngagementSettings,
    MetadataTaxon,
    createDefaultEngagementSettings,
} from 'models/engagement';
import { updatedDiff } from 'deep-object-diff';
import { getSlugByEngagementId } from 'services/engagementSlugService';
import {
    PatchEngagementSettingsRequest,
    getEngagementSettings,
    patchEngagementSettings,
} from 'services/engagementSettingService';
import { getEngagementMetadata, getMetadataTaxa } from 'services/engagementMetadataService';
import { EngagementSlugPatchRequest, patchEngagementSlug } from 'services/engagementSlugService';
import { EngagementForm } from '../types';
import { SubmissionStatus } from 'constants/engagementStatus';

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

interface EngagementSettingsSlugData {
    slug: string;
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
    tenantTaxa: MetadataTaxon[];
    setTenantTaxa: React.Dispatch<React.SetStateAction<MetadataTaxon[]>>;
    // engagementMetadata: EngagementMetadata[];
    metadataFormRef: React.RefObject<HTMLFormElement> | null;
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
}

export const EngagementTabsContext = createContext<EngagementTabsContextState>({
    engagementFormData: initialEngagementFormData,
    setEngagementFormData: () => {
        throw new Error('setEngagementFormData is unimplemented');
    },
    // engagementMetadata: [],
    metadataFormRef: null,
    tenantTaxa: [],
    setTenantTaxa: () => {
        throw new Error('setTenantTaxa is unimplemented');
    },
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
        content: savedEngagement.content || '',
        is_internal: savedEngagement.is_internal || false,
        consent_message: savedEngagement.consent_message || '',
    });
    const [tenantTaxa, setTenantTaxa] = useState<MetadataTaxon[]>([]);
    const [richDescription, setRichDescription] = useState(savedEngagement?.rich_description || '');
    const [richContent, setRichContent] = useState(savedEngagement?.rich_content || '');
    const [richConsentMessage, setRichConsentMessage] = useState(savedEngagement?.consent_message || '');
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
            setSaving(false);
            return;
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to update settings, please refresh the page or try again at a later time',
                }),
            );
            setSaving(false);
        }
    };

    const fetchMetadata = async () => {
        try {
            const taxaData = await getMetadataTaxa();
            const engagementMetadata = await getEngagementMetadata(savedEngagement.id);
            engagementMetadata.forEach((metadata) => {
                const taxon = taxaData[metadata.taxon_id];
                if (taxon) {
                    if (taxon.entries === undefined) {
                        taxon.entries = [];
                    }
                    taxon.entries.push(metadata);
                }
            });
            setTenantTaxa(Object.values(taxaData));
        } catch (error) {
            console.error('Error fetching taxa:', error);
        }
    };

    useEffect(() => {
        fetchMetadata();
    }, []);

    const updateMetadata = (taxonId: number, value: MetadataTaxon) => {
        setTenantTaxa((prev) => {
            const index = prev.findIndex((taxon) => taxon.id === taxonId);
            if (index === -1) {
                return prev;
            }
            const newTaxa = [...prev];
            newTaxa[index] = value;
            return newTaxa;
        });
    };

    const fetchMetadata = async () => {
        try {
            const taxaData = await getMetadataTaxa();
            const engagementMetadata = await getEngagementMetadata(savedEngagement.id);
            engagementMetadata.forEach((metadata) => {
                const taxon = taxaData[metadata.taxon_id];
                if (taxon) {
                    if (taxon.entries === undefined) {
                        taxon.entries = [];
                    }
                    taxon.entries.push(metadata);
                }
            });
            setTenantTaxa(Object.values(taxaData));
        } catch (error) {
            console.error('Error fetching taxa:', error);
        }
    };

    useEffect(() => {
        fetchMetadata();
    }, []);

    const updateMetadata = (taxonId: number, value: MetadataTaxon) => {
        setTenantTaxa((prev) => {
            const index = prev.findIndex((taxon) => taxon.id === taxonId);
            if (index === -1) {
                return prev;
            }
            const newTaxa = [...prev];
            newTaxa[index] = value;
            return newTaxa;
        });
    };

    const [savedSlug, setSavedSlug] = useState('');
    const [slug, setSlug] = useState<EngagementSettingsSlugData>(initialEngagementSettingsSlugData);

    const handleGetSlug = async () => {
        if (!savedEngagement.id) return;

        try {
            const response = await getSlugByEngagementId(savedEngagement.id);
            setSavedSlug(response.slug);
            setSlug({ slug: response.slug });
        } catch (error) {
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
            setSaving(false);
            return;
        } catch (error) {
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
        },
        {
            survey_status: SUBMISSION_STATUS.OPEN,
            block_text: surveyBlockText.Open,
        },
        {
            survey_status: SUBMISSION_STATUS.CLOSED,
            block_text: surveyBlockText.Closed,
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
                  rich_content: richContent,
                  status_block: surveyBlockList,
              });

        if (!isNewEngagement) {
            await updateEngagementSettings(sendReport);
            await handleSaveSlug(slug);
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
                tenantTaxa,
                setTenantTaxa,
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
            }}
        >
            {children}
        </EngagementTabsContext.Provider>
    );
};

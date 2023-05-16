import React, { createContext, useContext, useState } from 'react';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { User } from 'models/user';
import { ActionContext } from '../ActionContext';
import { EngagementTeamMember } from 'models/engagementTeamMember';
import { getTeamMembers } from 'services/membershipService';
import { openNotification } from 'services/notificationService/notificationSlice';
import { useAppDispatch } from 'hooks';
import { ProjectMetadata } from 'models/engagement';

interface EngagementFormData {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    content: string;
    is_internal: boolean;
    project_id: string;
    project_metadata: ProjectMetadata;
}

const initialEngagementFormData = {
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    content: '',
    is_internal: false,
    project_id: '',
    project_metadata: {
        project_name: '',
        type: '',
        client_name: '',
        application_number: '',
    },
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
        project_id: engagementMetadata.project_id,
        project_metadata: {
            project_name: engagementMetadata?.project_metadata?.project_name || '',
            client_name: engagementMetadata?.project_metadata?.client_name || '',
            type: engagementMetadata?.project_metadata?.type || '',
            application_number: engagementMetadata?.project_metadata?.application_number || '',
        },
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
            }}
        >
            {children}
        </EngagementTabsContext.Provider>
    );
};

import React, { createContext, useContext, useState } from 'react';
import { createDefaultPageInfo, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { SubmissionStatusTypes, SUBMISSION_STATUS } from 'constants/engagementStatus';
import { User } from 'models/user';
import { ActionContext } from '../ActionContext';

interface EngagementFormData {
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    content: string;
}

const initialEngagementFormData = {
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    content: '',
};

interface EngagementFormError {
    name: boolean;
    start_date: boolean;
    end_date: boolean;
}

const initialFormError = {
    name: false,
    start_date: false,
    end_date: false,
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
    pageInfo: PageInfo;
    setPageInfo: React.Dispatch<React.SetStateAction<PageInfo>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    paginationOptions: PaginationOptions<User>;
    setPaginationOptions: React.Dispatch<React.SetStateAction<PaginationOptions<User>>>;
    surveyBlockText: { [key in SubmissionStatusTypes]: string };
    setSurveyBlockText: React.Dispatch<React.SetStateAction<{ [key in SubmissionStatusTypes]: string }>>;
    addTeamMemberOpen: boolean;
    setAddTeamMemberOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

    pageInfo: createDefaultPageInfo(),
    setPageInfo: () => {
        throw new Error('setPageInfo is unimplemented');
    },
    users: [],
    setUsers: () => {
        throw new Error('setUsers is unimplemented');
    },
    paginationOptions: {
        page: 0,
        size: 0,
    },
    setPaginationOptions: () => {
        throw new Error('Not implemented');
    },
    addTeamMemberOpen: false,
    setAddTeamMemberOpen: () => {
        throw new Error('Set team member open not implemented');
    },
});

export const EngagementTabsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { savedEngagement } = useContext(ActionContext);
    const [engagementFormData, setEngagementFormData] = useState<EngagementFormData>({
        name: savedEngagement?.name || '',
        start_date: savedEngagement.start_date,
        end_date: savedEngagement.end_date,
        description: savedEngagement?.description || '',
        content: savedEngagement?.content || '',
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
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<User>>({
        page: 1,
        size: 10,
        sort_key: 'first_name',
        nested_sort_key: 'first_name',
        sort_order: 'asc',
    });
    const [addTeamMemberOpen, setAddTeamMemberOpen] = useState(false);

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
                pageInfo,
                setPageInfo,
                paginationOptions,
                setPaginationOptions,
                addTeamMemberOpen,
                setAddTeamMemberOpen,
            }}
        >
            {children}
        </EngagementTabsContext.Provider>
    );
};

import React, { createContext, useEffect, useState } from 'react';
import { SurveyReportSetting } from 'models/surveyReportSetting';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { openNotification } from 'services/notificationService/notificationSlice';
import { fetchSurveyReportSettings, updateSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export interface SearchFilter {
    key: keyof SurveyReportSetting;
    value: string;
}
export interface SurveyReportSettingsContextProps {
    tableLoading: boolean;
    surveyReportSettings: SurveyReportSetting[];
    searchFilter: SearchFilter;
    setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
    savingSettings: boolean;
    setSavingSettings: React.Dispatch<React.SetStateAction<boolean>>;
    handleSaveSettings: (settings: SurveyReportSetting[]) => void;
}

export const ReportSettingsContext = createContext<SurveyReportSettingsContextProps>({
    tableLoading: false,
    surveyReportSettings: [],
    searchFilter: { key: 'question', value: '' },
    setSearchFilter: () => {
        throw new Error('setSearchFilter function must be overridden');
    },
    savingSettings: false,
    setSavingSettings: () => {
        throw new Error('setSavingSettings function must be overridden');
    },
    handleSaveSettings: () => {
        throw new Error('handleSaveSettings function must be overridden');
    },
});

export const ReportSettingsContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [tableLoading, setTableLoading] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<SearchFilter>({
        key: 'question',
        value: '',
    });
    const [surveyReportSettings, setSurveyReportSettings] = useState<SurveyReportSetting[]>([]);
    const [savingSettings, setSavingSettings] = useState<boolean>(false);
    const { surveyId } = useParams<{ surveyId: string }>();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const loadSurveySettings = async () => {
        if (!surveyId || isNaN(Number(surveyId))) {
            return;
        }
        try {
            setTableLoading(true);
            const settings = await fetchSurveyReportSettings(surveyId);
            setSurveyReportSettings(settings);
            setTableLoading(false);
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while loading settings. Please try again.',
                }),
            );
        }
    };
    useEffect(() => {
        loadSurveySettings();
    }, [surveyId]);

    const handleNavigateOnSave = () => {
        if (location.state.engagementId) {
            navigate(`/engagements/${location.state.engagementId}/form`);
            return;
        }
        navigate(`/surveys`);
    };
    const handleSaveSettings = async (settings: SurveyReportSetting[]) => {
        if (!surveyId || isNaN(Number(surveyId))) {
            setSavingSettings(false);
            return;
        }

        if (!settings.length) {
            handleNavigateOnSave();
            return;
        }

        try {
            await updateSurveyReportSettings(surveyId, settings);
            setSavingSettings(false);
            dispatch(
                openNotification({
                    severity: 'success',
                    text: 'Settings saved successfully.',
                }),
            );
            handleNavigateOnSave();
        } catch (error) {
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while saving settings. Please try again.',
                }),
            );
            setSavingSettings(false);
        }
    };

    return (
        <ReportSettingsContext.Provider
            value={{
                tableLoading,
                surveyReportSettings,
                searchFilter,
                setSearchFilter,
                savingSettings,
                setSavingSettings,
                handleSaveSettings,
            }}
        >
            {children}
        </ReportSettingsContext.Provider>
    );
};

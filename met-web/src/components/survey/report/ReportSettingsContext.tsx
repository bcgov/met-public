import { SurveyReportSetting } from 'models/surveyReportSetting';
import React, { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [tableLoading, setTableLoading] = React.useState<boolean>(false);
    const [searchFilter, setSearchFilter] = React.useState<SearchFilter>({
        key: 'question',
        value: '',
    });
    const [surveyReportSettings, setSurveyReportSettings] = React.useState<SurveyReportSetting[]>([]);
    const [savingSettings, setSavingSettings] = React.useState<boolean>(false);
    const { surveyId } = useParams<{ surveyId: string }>();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loadSurveySettings = async () => {
        if (!surveyId || isNaN(Number(surveyId))) {
            return;
        }
        setTableLoading(true);
        const settings = await fetchSurveyReportSettings(surveyId);
        setSurveyReportSettings(settings);
        setTableLoading(false);
    };
    useEffect(() => {
        loadSurveySettings();
    }, [surveyId]);

    const handleSaveSettings = async (settings: SurveyReportSetting[]) => {
        if (!surveyId || isNaN(Number(surveyId)) || !settings.length) {
            setSavingSettings(false);
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
            navigate(`/surveys`);
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

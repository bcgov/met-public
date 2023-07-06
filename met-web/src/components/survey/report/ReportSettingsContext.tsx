import { SurveyReportSetting } from 'models/surveyReportSetting';
import React, { createContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export interface SearchFilter {
    key: keyof SurveyReportSetting;
    value: string;
}
export interface SurveyReportSettingsContextProps {
    tableLoading: boolean;
    surveyReportSettings: SurveyReportSetting[];
    searchFilter: SearchFilter;
    setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
}

export const ReportSettingsContext = createContext<SurveyReportSettingsContextProps>({
    tableLoading: false,
    surveyReportSettings: [],
    searchFilter: { key: 'question', value: '' },
    setSearchFilter: () => {
        throw new Error('setSearchFilter function must be overridden');
    },
});

export const ReportSettingsContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [tableLoading, setTableLoading] = React.useState<boolean>(false);
    const [searchFilter, setSearchFilter] = React.useState<SearchFilter>({
        key: 'question',
        value: '',
    });
    const [surveyReportSettings, setSurveyReportSettings] = React.useState<SurveyReportSetting[]>([]); // TODO: replace any with SurveyReportSetting[
    const { surveyId } = useParams<{ surveyId: string }>();

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

    return (
        <ReportSettingsContext.Provider
            value={{
                tableLoading,
                surveyReportSettings,
                searchFilter,
                setSearchFilter,
            }}
        >
            {children}
        </ReportSettingsContext.Provider>
    );
};

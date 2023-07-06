import { SurveyReportSetting } from 'models/surveyReportSetting';
import React, { createContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSurveyReportSettings } from 'services/surveyService/reportSettingsService';

export interface SurveyReportSettingsContextProps {
    tableLoading: boolean;
    surveyReportSettings: SurveyReportSetting[];
}

export const ReportSettingsContext = createContext<SurveyReportSettingsContextProps>({
    tableLoading: false,
    surveyReportSettings: [],
});

export const ReportSettingsContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [tableLoading, setTableLoading] = React.useState<boolean>(false);
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
            }}
        >
            {children}
        </ReportSettingsContext.Provider>
    );
};

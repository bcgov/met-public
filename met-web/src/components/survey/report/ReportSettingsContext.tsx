import React, { createContext } from 'react';

export interface SurveyReportSettingsContextProps {
    tableLoading: boolean;
}

export const ReportSettingsContext = createContext<SurveyReportSettingsContextProps>({
    tableLoading: false,
});

export const ReportSettingsContextProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
    const [tableLoading, setTableLoading] = React.useState<boolean>(false);
    return (
        <ReportSettingsContext.Provider
            value={{
                tableLoading,
            }}
        >
            {children}
        </ReportSettingsContext.Provider>
    );
};

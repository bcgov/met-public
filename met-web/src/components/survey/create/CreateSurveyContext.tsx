import React, { createContext, useState, useEffect } from 'react';

interface CreateSurveyContextValues {
    tabValue: number;
    handleTabValueChange: (newTabValue: number) => void;
}
export const CreateSurveyContext = createContext<CreateSurveyContextValues>({
    tabValue: 0,
    handleTabValueChange: (_newTabValue: number) => {
        //empty method
    },
});

export const CreateSurveyContextProvider = ({ children }: { children: JSX.Element }) => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabValueChange = (newTabValue: number) => {
        setTabValue(newTabValue);
    };

    return (
        <CreateSurveyContext.Provider
            value={{
                tabValue,
                handleTabValueChange,
            }}
        >
            {children}
        </CreateSurveyContext.Provider>
    );
};

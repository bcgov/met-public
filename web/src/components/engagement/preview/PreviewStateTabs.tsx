import React from 'react';
import { Tab, ThemeProvider } from '@mui/material';
import { AdminTheme, colors } from 'styles/Theme';
import { TabContext, TabList } from '@mui/lab';

export type SubmissionStatusTypes = 'Upcoming' | 'Open' | 'Closed' | 'ViewResults';

interface PreviewStateTabsProps {
    selectedState: SubmissionStatusTypes;
    onStateChange: (state: SubmissionStatusTypes) => void;
}

/**
 * Tab selector for switching between engagement preview states.
 * Allows viewing the engagement in different states without modifying the actual engagement.
 */
export const PreviewStateTabs: React.FC<PreviewStateTabsProps> = ({ selectedState, onStateChange }) => {
    const handleChange = (_event: React.SyntheticEvent, newValue: SubmissionStatusTypes) => {
        onStateChange(newValue);
    };

    return (
        <ThemeProvider theme={AdminTheme}>
            <TabContext value={selectedState}>
                <TabList
                    component="nav"
                    aria-label="Engagement Preview State Selector"
                    onChange={handleChange}
                    slotProps={{ indicator: { sx: { display: 'none' } } }}
                    sx={{
                        marginLeft: 'auto',
                        '& .MuiTabs-indicator': {
                            backgroundColor: colors.surface.blue[70],
                        },
                    }}
                >
                    {['Upcoming', 'Open', 'Closed', 'ViewResults'].map((state) => (
                        <Tab
                            key={state}
                            label={state === 'ViewResults' ? 'View Results' : state}
                            value={state}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '48px',
                                padding: '4px 24px 2px 18px',
                                fontSize: '14px',
                                borderRadius: '0px 16px 0px 0px',
                                boxShadow:
                                    '0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)',
                                backgroundColor: 'gray.10',
                                color: 'text.secondary',
                                fontWeight: 'normal',
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.main',
                                    borderColor: 'primary.main',
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                                outlineOffset: '-4px',
                                '&:focus-visible': {
                                    outline: `2px solid`,
                                    outlineColor: 'focus.inner',
                                    border: '4px solid',
                                    borderColor: 'focus.outer',
                                    padding: '0px 20px 0px 14px',
                                },
                            }}
                        />
                    ))}
                </TabList>
            </TabContext>
        </ThemeProvider>
    );
};

export default PreviewStateTabs;

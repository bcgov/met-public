import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { FormInfo } from 'components/Form/types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export interface ProgressBarProps {
    currentPage: number;
    totalPages: number;
    pages: Array<FormInfo>;
}

function FormStepper({ currentPage, totalPages, pages }: ProgressBarProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ pb: 2 }}>
                <Stepper activeStep={currentPage} alternativeLabel>
                    {pages.map((page: FormInfo, index: number) => (
                        <Step key={index}>
                            <StepLabel> {(!isMobile || index === currentPage) && page.title}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </ThemeProvider>
    );
}

export default FormStepper;

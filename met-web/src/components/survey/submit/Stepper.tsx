import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { FormInfo } from 'components/Form/types';

export interface ProgressBarProps {
    currentPage: number;
    totalPages: number;
    pages: Array<FormInfo>;
}

function FormStepper({ currentPage, totalPages, pages }: ProgressBarProps) {
    return (
        <Box sx={{ pb: 2 }}>
            <Stepper activeStep={currentPage} alternativeLabel>
                {pages.map((page: FormInfo, index: number) => (
                    <Step key={index}>
                        <StepLabel>{page.title}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default FormStepper;

import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export interface ProgressBarProps {
    currentPage: number;
    totalPages: number;
    pages: Array<unknown>;
}

function FormStepper({ currentPage, totalPages, pages }: ProgressBarProps) {
    const getIcon = (index: number) => {
        return <InfoIcon />;
    };

    return (
        <Box sx={{ pb: 2 }}>
            <Stepper activeStep={currentPage} alternativeLabel>
                {pages.map((page: unknown, index: number) => (
                    <Step key={index}>
                        <StepLabel>{page.title}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

export default FormStepper;

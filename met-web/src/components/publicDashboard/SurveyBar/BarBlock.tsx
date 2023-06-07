import React from 'react';
import { SurveyBarData } from '../types';
import { MobileSurveyBarBlock } from './MobileSurveyBarBlock';
import { SurveyBarBlock } from './SurveyBarBlock';
import { useMediaQuery, Theme } from '@mui/material';

interface BarBlockProps {
    data: SurveyBarData;
}
export const BarBlock = ({ data }: BarBlockProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return <>{isSmallScreen ? <MobileSurveyBarBlock data={data} /> : <SurveyBarBlock data={data} />}</>;
};

export default BarBlock;

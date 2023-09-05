import React from 'react';
import { MetPageGridContainer, MetPaper } from 'components/common';
import { Tabs } from './tabs';

export const Form = () => {
    return (
        <MetPageGridContainer>
            <MetPaper sx={{ padding: '3em' }}>
                <Tabs />
            </MetPaper>
        </MetPageGridContainer>
    );
};

import React from 'react';
import { Grid, GridProps, Box, BoxProps } from '@mui/material';
import { BodyText } from 'components/common/Typography';

export const AuthoringFormContainer = ({
    children,
    ...formContainerProps
}: { children: React.ReactNode } & GridProps) => {
    return (
        <Grid
            className="met-layout-authoring-form-container"
            container
            display="flex"
            flexDirection="column"
            gap="24px"
            maxWidth="700px"
            {...formContainerProps}
        >
            {children}
        </Grid>
    );
};

export const UnnamedAuthoringFormSection = ({
    children,
    required,
    gridItemProps,
    ...formSectionProps
}: { children: React.ReactNode; required?: boolean; gridItemProps?: GridProps } & BoxProps) => {
    return (
        <Grid item {...gridItemProps} className="met-layout-authoring-form-grid-item">
            <Box
                className="met-layout-authoring-form-section"
                display="flex"
                flexDirection="column"
                gap="24px"
                bgcolor={required ? 'blue.10' : 'gray.10'}
                padding="2rem 1.4rem"
                margin="1rem 0"
                borderRadius="16px"
                {...formSectionProps}
            >
                {children}
            </Box>
        </Grid>
    );
};

export const AuthoringFormSection = ({
    children,
    required,
    name,
    details,
    labelFor,
    gridItemProps,
    ...formSectionProps
}: {
    children: React.ReactNode;
    required?: boolean;
    name?: string;
    details?: string;
    labelFor?: string;
    gridItemProps?: GridProps;
} & BoxProps) => {
    return (
        <UnnamedAuthoringFormSection required={required} gridItemProps={gridItemProps} {...formSectionProps}>
            {name && (
                <Box
                    className="met-layout-authoring-form-section-title"
                    display="flex"
                    flexDirection="column"
                    gap="8px"
                    component={labelFor ? 'label' : 'div'}
                    htmlFor={labelFor}
                >
                    <Box fontSize="1.05rem" lineHeight="1.5" color="text.primary" fontWeight="700">
                        {name}
                        <BodyText fontWeight="400" display="inline">
                            {required ? ' (Required)' : ' (Optional)'}
                        </BodyText>
                    </Box>
                    {details && (
                        <Box fontSize="0.875rem" lineHeight={12 / 7}>
                            {details}
                        </Box>
                    )}
                </Box>
            )}
            {children}
        </UnnamedAuthoringFormSection>
    );
};

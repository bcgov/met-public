import React from 'react';
import { Box, Grid } from '@mui/material';
import {
    faCircle1,
    faCircle2,
    faCircle3,
    faCircle4,
    faCircle5,
    faCircle6,
    faCircle7,
    faCircle8,
    faCircle9,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { colors } from 'styles/Theme';
import { BodyText, Header2 } from '../Typography';

export const circleNumberIcons = [
    faCircle1,
    faCircle2,
    faCircle3,
    faCircle4,
    faCircle5,
    faCircle6,
    faCircle7,
    faCircle8,
    faCircle9,
];

export const FormStep = ({
    step,
    completing,
    completed,
    question,
    details,
    children,
}: {
    step: number;
    completing?: boolean;
    completed?: boolean;
    question?: string;
    details?: string;
    children?: React.ReactNode;
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const activityColor = completed || completing || isFocused ? colors.surface.blue[90] : colors.surface.gray[70];

    return (
        <Grid
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={1}
            sx={{
                padding: '1rem',
                backgroundColor: 'white',
                marginBottom: '1rem',
                maxWidth: '100%',
            }}
        >
            <Grid
                item
                container
                alignItems="stretch"
                direction="column"
                gap={1}
                sx={{ pt: 1.25, fontSize: '16px', width: '3rem' }}
            >
                <Grid item>
                    <FontAwesomeIcon
                        icon={completed ? faCircleCheck : circleNumberIcons[step - 1]}
                        color={activityColor}
                        size="2x"
                    />
                </Grid>
                <Grid item xs>
                    <Box
                        sx={{
                            height: '100%',
                            width: '1rem',
                            borderRight: '1px solid',
                            borderColor: activityColor,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid item container xs justifyContent="flex-start" alignItems="flex-start" pb="16px">
                <Grid item xs={12}>
                    <Header2 sx={{ mt: 0, fontSize: '20px', fontWeight: '300' }}>{question}</Header2>
                </Grid>
                {details && (
                    <Grid item sx={{ marginTop: '-0.5rem', marginBottom: '1.5rem' }}>
                        <BodyText size="small">{details}</BodyText>
                    </Grid>
                )}
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Grid>
    );
};

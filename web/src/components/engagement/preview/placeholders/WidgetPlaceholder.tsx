import React from 'react';
import { Grid2 as Grid, GridProps } from '@mui/material';
import { BodyText } from 'components/common/Typography';

interface WidgetPlaceholderProps extends GridProps {
    title: string;
}

/**
 * Dotted outline placeholder for widgets in preview mode.
 * Shows a dotted border with widget type label.
 */
export const WidgetPlaceholder: React.FC<WidgetPlaceholderProps> = ({ title, ...GridProps }) => {
    return (
        <Grid
            container
            size={12}
            {...GridProps}
            sx={[
                {
                    border: `2px dashed currentColor`,
                    backgroundColor: 'transparent',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
                    color: 'primary.light',
                },
                ...(Array.isArray(GridProps.sx) ? GridProps.sx : [GridProps.sx]),
            ]}
        >
            <Grid container maxWidth={250} direction="column" gap={4}>
                <BodyText size="large" color="currentColor" textAlign="center" fontSize="20px">
                    {title}
                </BodyText>
                <BodyText size="small" color="currentColor" textAlign="center">
                    If you do not add supporting content, this area will be empty.
                </BodyText>
            </Grid>
        </Grid>
    );
};

export default WidgetPlaceholder;

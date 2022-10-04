import React, { ReactNode } from 'react';
import { MetPaper, MetHeader3, MetBody } from 'components/common';
import { Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { When } from 'react-if';

interface WidgetOptionCardProps {
    icon?: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}
const WidgetOptionCard = ({ title, description, icon, onClick }: WidgetOptionCardProps) => {
    return (
        <MetPaper
            elevation={1}
            sx={{ padding: '1px 2px 1px 2px', cursor: 'pointer', '&:hover': { backgroundColor: 'rgb(242, 242, 242)' } }}
            onClick={onClick}
        >
            <Grid container alignItems="flex-start" justifyContent="flex-start" direction="row" columnSpacing={2}>
                <When condition={Boolean(icon)}>
                    <Grid item>
                        <PersonIcon sx={{ fontSize: '5em' }} />
                    </Grid>
                </When>
                <Grid
                    container
                    item
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    direction="row"
                    rowSpacing={1}
                    xs={Boolean(icon) ? 8 : 12}
                >
                    <Grid item xs={12}>
                        <MetHeader3>{title}</MetHeader3>
                    </Grid>
                    <Grid item xs={12}>
                        <MetBody>{description}</MetBody>
                    </Grid>
                </Grid>
            </Grid>
        </MetPaper>
    );
};

export default WidgetOptionCard;

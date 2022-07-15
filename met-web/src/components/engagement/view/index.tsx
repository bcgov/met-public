import React, { useState } from 'react';
import { Grid, Button, formLabelClasses } from '@mui/material';
import { EngagementBanner } from './EngagementBanner';
import { ActionProvider } from './ActionContext';
import { EngagementContent } from './EngagementContent';
import SurveyBlock from './SurveyBlock';
import EmailModal from 'components/survey/submit/EmailModal';

const Engagement = () => {
    const [open, setOpen] = useState(true);

    return (
        <ActionProvider>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <EngagementBanner />
                    <Button variant="contained" onClick={() => setOpen(!open)}>
                        Share your thoughts
                    </Button>
                    <EmailModal open={open} handleClose={() => setOpen(false)} />
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    direction="row"
                    justifyContent={'flex-start'}
                    alignItems="flex-start"
                    sx={{ margin: '1em 2em 1em 3em' }}
                    m={{ lg: '0 8em 1em 3em', md: '2em', xs: '1em' }}
                    rowSpacing={2}
                >
                    <Grid item xs={12} lg={8}>
                        <EngagementContent />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <SurveyBlock />
                    </Grid>
                </Grid>
            </Grid>
        </ActionProvider>
    );
};

export default Engagement;

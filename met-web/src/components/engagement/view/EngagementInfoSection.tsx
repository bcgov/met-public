import React, { useContext } from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import { MetHeader1 } from 'components/common';
import { EngagementStatusChip } from '../status';
import { Editor } from 'react-draft-wysiwyg';
import { getEditorState } from 'utils';
import dayjs from 'dayjs';
import { ActionContext } from './ActionContext';
import { Engagement } from 'models/engagement';

interface EngagementInfoSectionProps {
    savedEngagement: Engagement;
    children?: React.ReactNode;
}
const EngagementInfoSection = ({ savedEngagement, children }: EngagementInfoSectionProps) => {
    const { name, end_date, start_date, rich_description } = savedEngagement;
    const { mockStatus } = useContext(ActionContext);
    const dateFormat = 'MMM DD, YYYY';

    const EngagementDate = `Engagement dates: ${dayjs(start_date).format(dateFormat)} to ${dayjs(end_date).format(
        dateFormat,
    )}`;

    return (
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            height="100%"
            sx={{
                position: 'absolute',
                top: '0px',
                left: '0px',
            }}
        >
            <Grid
                item
                lg={6}
                sm={12}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                sx={{
                    backgroundColor: 'rgba(242, 242, 242, 0.95)',
                    padding: '1em',
                    margin: '1em',
                    maxWidth: '90%',
                }}
                m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
            >
                <Grid item xs={12} sx={{ maxHeight: '20em', overflowY: 'auto', overflowX: 'auto' }}>
                    <MetHeader1>{name}</MetHeader1>
                    <Grid item xs={12} sx={{ mb: 1 }}>
                        <Editor editorState={getEditorState(rich_description)} readOnly={true} toolbarHidden />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" color="black">
                        {EngagementDate}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <Typography sx={{ fontWeight: 800 }} variant="subtitle1">
                            Status:
                        </Typography>
                        <EngagementStatusChip submissionStatus={mockStatus} />
                    </Stack>
                </Grid>
                {children}
            </Grid>
        </Grid>
    );
};

export default EngagementInfoSection;

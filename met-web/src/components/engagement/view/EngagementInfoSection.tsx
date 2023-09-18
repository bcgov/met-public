import React, { useContext } from 'react';
import { Grid, Stack } from '@mui/material';
import { MetHeader1, MetLabel } from 'components/common';
import { EngagementStatusChip } from '../status';
import { Editor } from 'react-draft-wysiwyg';
import dayjs from 'dayjs';
import { ActionContext } from './ActionContext';
import { Engagement } from 'models/engagement';
import { useAppSelector } from 'hooks';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';

interface EngagementInfoSectionProps {
    savedEngagement: Engagement;
    children?: React.ReactNode;
}
const EngagementInfoSection = ({ savedEngagement, children }: EngagementInfoSectionProps) => {
    const { name, end_date, start_date, rich_description, submission_status } = savedEngagement;
    const { mockStatus } = useContext(ActionContext);
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const isPreview = isLoggedIn;
    const statusName = isPreview ? mockStatus : submission_status;
    const dateFormat = 'MMM DD, YYYY';

    const EngagementDate =
        start_date && end_date
            ? `Engagement dates: ${dayjs(start_date).format(dateFormat)} to ${dayjs(end_date).format(dateFormat)}`
            : 'Engagement dates not defined.';

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
                pt: 0,
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
                    paddingTop: 0,
                }}
                m={{ lg: '3em 5em 0 3em', md: '3em', sm: '1em' }}
                spacing={1}
            >
                <Grid item xs={12} sx={{ maxHeight: '15em', overflowY: 'auto', overflowX: 'auto' }}>
                    <MetHeader1>{name}</MetHeader1>
                    <Grid item xs={12}>
                        <Editor editorState={getEditorStateFromRaw(rich_description)} readOnly={true} toolbarHidden />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <MetLabel>{EngagementDate}</MetLabel>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                        <MetLabel>Status:</MetLabel>
                        <EngagementStatusChip submissionStatus={statusName} />
                    </Stack>
                </Grid>
                {children}
            </Grid>
        </Grid>
    );
};

export default EngagementInfoSection;

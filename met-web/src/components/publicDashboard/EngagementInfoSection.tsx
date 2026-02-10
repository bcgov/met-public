import React from 'react';
import { Grid, Stack } from '@mui/material';
import { MetHeader1Old, MetLabel } from 'components/common';
import { EngagementStatusChip } from 'components/common/Indicators';
import { Editor } from 'react-draft-wysiwyg';
import dayjs from 'dayjs';
import { Engagement } from 'models/engagement';
import { getEditorStateFromRaw } from 'components/common/RichTextEditor/utils';
import { When } from 'react-if';
import { EngagementStatus, SubmissionStatus } from 'constants/engagementStatus';

interface EngagementInfoSectionProps {
    savedEngagement: Engagement;
    children?: React.ReactNode;
}
const EngagementInfoSection = ({ savedEngagement, children }: EngagementInfoSectionProps) => {
    const { name, end_date, start_date, rich_description, submission_status: statusId } = savedEngagement;
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
                    <MetHeader1Old>{name}</MetHeader1Old>
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
                        <EngagementStatusChip statusId={statusId} />
                        <When condition={savedEngagement.status_id === EngagementStatus.Unpublished}>
                            <EngagementStatusChip statusId={SubmissionStatus.Unpublished} />
                        </When>
                    </Stack>
                </Grid>
                {children}
            </Grid>
        </Grid>
    );
};

export default EngagementInfoSection;

import React, { Suspense, useEffect } from 'react';
import { Avatar, Box, Grid, IconButton, Skeleton, Tooltip } from '@mui/material';
import { BodyText, Header2 } from '../../../common/Typography';
import { OutlineBox } from 'components/common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/pro-light-svg-icons';
import { globalFocusVisible } from 'components/common';
import { getBaseUrl } from 'helper';
import { Await, useAsyncValue } from 'react-router-dom';
import { Engagement } from 'models/engagement';
import { EngagementStatusChip } from 'components/common/Indicators';
import { SubmissionStatus } from 'constants/engagementStatus';
import dayjs from 'dayjs';
import { ENGAGEMENT_MEMBERSHIP_STATUS, EngagementTeamMember } from 'models/engagementTeamMember';
import { Button } from 'components/common/Input';
import { faPen } from '@fortawesome/pro-regular-svg-icons';

export const ConfigSummary = () => {
    const siteUrl = getBaseUrl();
    const [engagement, teamMembers, slug] = useAsyncValue() as [Engagement, EngagementTeamMember[], string];
    const [tooltipOpen, setTooltipOpen] = React.useState(false);

    useEffect(() => {
        if (tooltipOpen) {
            const timer = setTimeout(() => {
                setTooltipOpen(false);
            }, 2000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [tooltipOpen]);

    return (
        <Box>
            <Header2 decorated>Configuration</Header2>
            <Grid container spacing={2} width="624px" maxWidth="100%" direction="column">
                <Grid item>
                    <OutlineBox>
                        <Grid container spacing={1} direction="column">
                            <Grid item>
                                <BodyText bold color="primary.main">
                                    Engagement URL
                                </BodyText>
                            </Grid>
                            <Grid item>
                                <Tooltip arrow open={tooltipOpen} title="Copied!" placement="top">
                                    <IconButton
                                        size="small"
                                        sx={{
                                            backgroundColor: 'primary.light',
                                            color: 'white',
                                            width: '32px',
                                            height: '32px',
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                            },
                                            ...globalFocusVisible,
                                            display: 'inline-block',
                                            marginRight: '0.5rem',
                                        }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${siteUrl}/${slug}`);
                                            setTooltipOpen(true);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            fontSize={16}
                                            icon={faCopy}
                                            style={{ position: 'relative', bottom: '4px' }}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <BodyText sx={{ display: 'inline' }}>
                                    <span style={{ fontWeight: 'bold' }}>{siteUrl}/</span>
                                    {slug}
                                </BodyText>
                            </Grid>
                        </Grid>
                    </OutlineBox>
                </Grid>
                <Grid item>
                    <OutlineBox>
                        <Grid container direction="row" spacing={1}>
                            <Grid item xs={12}>
                                <BodyText bold color="primary.main">
                                    Engagement Feedback Dates
                                </BodyText>
                            </Grid>
                            <Grid item xs="auto" container direction="column" spacing={2}>
                                <Grid item container spacing={1}>
                                    <Grid item width={{ xs: '100%', sm: '82px' }}>
                                        <EngagementStatusChip
                                            statusId={SubmissionStatus.Open}
                                            sx={{ '&>span.MuiChip-label': { padding: '4px 12px' } }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <BodyText bold sx={{ display: 'inline' }}>
                                            {dayjs(engagement.start_date).format('MMMM D, YYYY')}
                                        </BodyText>{' '}
                                        <BodyText sx={{ display: { xs: 'block', sm: 'inline' } }}>(12:01 am)</BodyText>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={1}>
                                    <Grid item width={{ xs: '100%', sm: '82px' }}>
                                        <EngagementStatusChip
                                            statusId={SubmissionStatus.Closed}
                                            sx={{ '&>span.MuiChip-label': { padding: '4px 12px' } }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <BodyText bold sx={{ display: 'inline' }}>
                                            {dayjs(engagement.end_date).format('MMMM D, YYYY')}
                                        </BodyText>{' '}
                                        <BodyText sx={{ display: { xs: 'block', sm: 'inline' } }}>(11:59 pm)</BodyText>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                item
                                xs="auto"
                                sx={{
                                    width: '100%',
                                    mb: 1,
                                    mt: { xs: 1, sm: 0 },
                                    maxWidth: { xs: '100%', sm: 'fit-content' },
                                }}
                            >
                                <BodyText bold size="large" sx={{ color: 'primary.light', lineHeight: 0.8 }}>
                                    <span style={{ fontSize: '72px' }}>
                                        {dayjs(engagement.end_date)
                                            .clone()
                                            .add(1, 'second')
                                            .diff(dayjs(engagement.start_date), 'days')}
                                    </span>
                                    <span style={{ position: 'relative', bottom: '16px', fontSize: '24px' }}>
                                        {' '}
                                        days
                                    </span>
                                </BodyText>
                            </Grid>
                        </Grid>
                    </OutlineBox>
                </Grid>
                <Grid item>
                    <OutlineBox>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <BodyText bold color="primary.main">
                                    Language(s) Included (1)
                                </BodyText>
                            </Grid>
                            <Grid item>
                                <BodyText bold>English (Default)</BodyText>
                            </Grid>
                        </Grid>
                    </OutlineBox>
                </Grid>
                <Grid item>
                    <OutlineBox>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <BodyText bold color="primary.main">
                                    Team Member(s) Added
                                </BodyText>
                            </Grid>
                            <Suspense fallback={<TeamMemberListSkeleton />}>
                                <Await resolve={teamMembers}>
                                    <TeamMemberList />
                                </Await>
                            </Suspense>
                        </Grid>
                    </OutlineBox>
                </Grid>
                <Grid item sx={{ pt: '40px' }}>
                    <Button href="../config" variant="secondary" icon={<FontAwesomeIcon icon={faPen} />}>
                        Edit Configuration
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

const TeamMemberList = () => {
    const teamMembers = (useAsyncValue() as EngagementTeamMember[]).filter(
        (teamMember) => teamMember.status === ENGAGEMENT_MEMBERSHIP_STATUS.Active,
    );
    if (!teamMembers.length) {
        return (
            <Grid item>
                <BodyText>No team members added</BodyText>
            </Grid>
        );
    }
    return (
        <>
            {teamMembers.map((teamMember) => (
                <Grid item container spacing={2} alignItems="center" key={teamMember.id}>
                    <Grid item>
                        <Avatar
                            sx={{
                                backgroundColor: 'primary.light',
                                height: 32,
                                width: 32,
                                fontSize: '16px',
                            }}
                        >
                            {teamMember.user.first_name[0]}
                            {teamMember.user.last_name[0]}
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <BodyText>
                            {teamMember.user.first_name} {teamMember.user.last_name}
                        </BodyText>
                        <BodyText>{teamMember.user.main_role}</BodyText>
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

const TeamMemberListSkeleton = () => {
    return (
        <>
            {[1, 2, 3].map((value) => (
                <Grid item container spacing={2} alignItems="center" key={value}>
                    <Grid item>
                        <Skeleton variant="circular" width={32} height={32} />
                    </Grid>
                    <Grid item>
                        <Skeleton variant="text" width={100} />
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

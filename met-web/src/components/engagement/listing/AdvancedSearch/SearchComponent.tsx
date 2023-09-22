import React, { useState } from 'react';
import {
    Grid,
    Stack,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Select,
    SelectChangeEvent,
    MenuItem,
    FormControl,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { MetParagraph, MetLabel } from 'components/common';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { PrimaryButton, SecondaryButton } from '../../../common';
import dayjs from 'dayjs';
import { formatToUTC } from 'components/common/dateHelper';
import { SearchOptions } from './SearchTypes';
import { AppConfig } from 'config';

interface filterParams {
    setFilterParams: (newsearchOptions: SearchOptions) => void;
}

const AdvancedSearch: React.FC<filterParams> = ({ setFilterParams }) => {
    const { engagementProjectTypes } = AppConfig.constants;
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

    const intitialStatusList = {
        [EngagementDisplayStatus[EngagementDisplayStatus.Draft]]: false,
        [EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]]: false,
        [EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]]: false,
        [EngagementDisplayStatus[EngagementDisplayStatus.Open]]: false,
        [EngagementDisplayStatus[EngagementDisplayStatus.Closed]]: false,
    };
    const [statusFilter, setStatusFilter] = useState(() => {
        return intitialStatusList;
    });

    const initialFilterParams = {
        status_list: [],
        project_name: '',
        project_id: '',
        application_number: '',
        client_name: '',
        project_type: '',
        created_from_date: '',
        created_to_date: '',
        published_from_date: '',
        published_to_date: '',
    };

    const [selectedStatusList, setSelectedStatusList] = useState<number[]>([]);

    const handleStatusFilterChange = (event: React.SyntheticEvent) => {
        setStatusFilter({
            ...statusFilter,
            [(event.target as HTMLInputElement).value]: (event.target as HTMLInputElement).checked,
        });
        const selectedStatusId = (event.target as HTMLInputElement).id;
        setSelectedStatusList((currentParticipants: number[]) =>
            currentParticipants.includes(parseInt(selectedStatusId))
                ? currentParticipants.filter((f) => f !== parseInt(selectedStatusId))
                : [...currentParticipants, parseInt(selectedStatusId)],
        );
    };

    const [projectFilter, setProjectFilter] = useState({
        projectType: '',
        projectId: '',
        projectName: '',
        clientName: '',
        applicationNumber: '',
    });

    const [dateFilter, setDateFilter] = useState({
        createdFromDate: '',
        createdToDate: '',
        publishedFromDate: '',
        publishedToDate: '',
    });
    const { createdFromDate, createdToDate, publishedFromDate, publishedToDate } = dateFilter;

    const { projectType, projectId, projectName, clientName, applicationNumber } = projectFilter;

    const handleDateFilterChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setDateFilter({
            ...dateFilter,
            [e.target.name]: e.target.value,
        });
    };

    const handleProjectDataChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent,
    ) => {
        setProjectFilter({
            ...projectFilter,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearch = () => {
        /*
        Database has the values in utc but the value we select from the calender is having only date without a time.
        So we need to convert:
        1) start dates to utc format 
        2) end dates to end of day and then to utc format
        */
        const fCreatedFromDate = createdFromDate ? formatToUTC(createdFromDate) : createdFromDate;
        const fCreatedToDate = createdToDate
            ? formatToUTC(dayjs(createdToDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
            : createdToDate;
        const fPublishedFromDate = publishedFromDate ? formatToUTC(publishedFromDate) : publishedFromDate;
        const fPublishedToDate = publishedToDate
            ? formatToUTC(dayjs(publishedToDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'))
            : publishedToDate;
        const fProjectType = projectType ? projectType : '';
        const fprojectId = projectId ? projectId : '';
        const fProjectName = projectName ? projectName : '';
        const fClientName = clientName ? clientName : '';
        const fAppNumber = applicationNumber ? applicationNumber : '';

        setFilterParams({
            status_list: selectedStatusList,
            created_from_date: fCreatedFromDate,
            created_to_date: fCreatedToDate,
            published_from_date: fPublishedFromDate,
            published_to_date: fPublishedToDate,
            project_type: fProjectType,
            project_id: fprojectId,
            project_name: fProjectName,
            client_name: fClientName,
            application_number: fAppNumber,
        });
    };

    const handleResetSearchFilters = () => {
        setStatusFilter(intitialStatusList);
        setSelectedStatusList([]);

        setProjectFilter({
            projectType: '',
            projectId: '',
            projectName: '',
            clientName: '',
            applicationNumber: '',
        });

        setDateFilter({
            createdFromDate: '',
            createdToDate: '',
            publishedFromDate: '',
            publishedToDate: '',
        });

        setFilterParams(initialFilterParams);
    };

    return (
        <Grid
            container
            direction="row"
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={1}
            mt={{ md: 2 }}
        >
            <Grid item xs={12} lg={2}>
                <FormControl component="fieldset">
                    <MetLabel>Status</MetLabel>
                    <FormGroup row={isMediumScreen}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Draft.toString()}
                                    data-testid={EngagementDisplayStatus.Draft.toString()}
                                    name={EngagementDisplayStatus[EngagementDisplayStatus.Draft]}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Draft]]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={
                                <MetParagraph>{EngagementDisplayStatus[EngagementDisplayStatus.Draft]}</MetParagraph>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Scheduled.toString()}
                                    data-testid={EngagementDisplayStatus.Scheduled.toString()}
                                    name={EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={
                                <MetParagraph>
                                    {EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]}
                                </MetParagraph>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Upcoming.toString()}
                                    data-testid={EngagementDisplayStatus.Upcoming.toString()}
                                    name={EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={
                                <MetParagraph>{EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]}</MetParagraph>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Open.toString()}
                                    data-testid={EngagementDisplayStatus.Open.toString()}
                                    name={EngagementDisplayStatus[EngagementDisplayStatus.Open]}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Open]]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<MetParagraph>{EngagementDisplayStatus[EngagementDisplayStatus.Open]}</MetParagraph>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Closed.toString()}
                                    data-testid={EngagementDisplayStatus.Closed.toString()}
                                    name={EngagementDisplayStatus[EngagementDisplayStatus.Closed]}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Closed]]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={
                                <MetParagraph>{EngagementDisplayStatus[EngagementDisplayStatus.Closed]}</MetParagraph>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Unpublished.toString()}
                                    data-testid={EngagementDisplayStatus.Unpublished.toString()}
                                    name={EngagementDisplayStatus[EngagementDisplayStatus.Unpublished]}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Unpublished]]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={
                                <MetParagraph>
                                    {EngagementDisplayStatus[EngagementDisplayStatus.Unpublished]}
                                </MetParagraph>
                            }
                        />
                    </FormGroup>
                </FormControl>
            </Grid>
            <Grid
                item
                xs={12}
                lg={10}
                container
                direction="row"
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={2}
                rowSpacing={4}
            >
                <Grid container item xs={12} md={6} xl={3} spacing={2}>
                    <Grid item xs={12}>
                        <MetLabel>Project Name</MetLabel>
                        <TextField
                            id="project-name"
                            data-testid="project-name"
                            type="project_name"
                            InputLabelProps={{
                                shrink: false,
                            }}
                            name="projectName"
                            value={projectName}
                            onChange={handleProjectDataChange}
                            InputProps={{ inputProps: { max: projectName || null } }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetLabel>Project #</MetLabel>
                        <TextField
                            id="project_id"
                            data-testid="project_id"
                            type="project_id"
                            InputLabelProps={{
                                shrink: false,
                            }}
                            name="projectId"
                            value={projectId}
                            onChange={handleProjectDataChange}
                            InputProps={{ inputProps: { max: projectId || null } }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetLabel>Application #</MetLabel>
                        <TextField
                            id="application_number"
                            data-testid="application_number"
                            type="application_number"
                            InputLabelProps={{
                                shrink: false,
                            }}
                            name="applicationNumber"
                            value={applicationNumber}
                            onChange={handleProjectDataChange}
                            InputProps={{ inputProps: { max: applicationNumber || null } }}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={12} md={6} xl={3} spacing={2}>
                    <Grid item xs={12}>
                        <MetLabel>Proponent</MetLabel>
                        <TextField
                            id="client_name"
                            data-testid="client_name"
                            type="clientName"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            name="clientName"
                            value={clientName}
                            onChange={handleProjectDataChange}
                            InputProps={{ inputProps: { min: clientName || null } }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MetLabel>Project Type</MetLabel>
                        <Select
                            id="project-type"
                            name="projectType"
                            variant="outlined"
                            label=" "
                            defaultValue=""
                            value={projectType}
                            onChange={handleProjectDataChange}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value={''} sx={{ fontStyle: 'italic', height: '2em' }}>
                                none
                            </MenuItem>
                            {engagementProjectTypes.map((type: string) => {
                                return (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={12}
                    xl={6}
                    container
                    direction="row"
                    alignItems={'flex-start'}
                    justifyContent={'flex-start'}
                    spacing={2}
                >
                    <Grid item xs={12} sm={6}>
                        <MetLabel>Date Created - From</MetLabel>
                        <TextField
                            id="createdFrom-date"
                            data-testid="createdFrom-date"
                            type="date"
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="createdFromDate"
                            value={createdFromDate}
                            onChange={handleDateFilterChange}
                            InputProps={{ inputProps: { max: createdToDate || null } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <MetLabel>Date Created - To</MetLabel>
                        <TextField
                            id="createdTo-date"
                            data-testid="createdTo-date"
                            type="date"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="createdToDate"
                            value={createdToDate}
                            onChange={handleDateFilterChange}
                            InputProps={{ inputProps: { min: createdFromDate || null } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <MetLabel>Date Published - From</MetLabel>
                        <TextField
                            id="publishedFrom-date"
                            data-testid="publishedFrom-date"
                            type="date"
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="publishedFromDate"
                            value={publishedFromDate}
                            onChange={handleDateFilterChange}
                            InputProps={{ inputProps: { max: publishedToDate || null } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <MetLabel>Date Published - To</MetLabel>
                        <TextField
                            id="createdTo-date"
                            data-testid="createdTo-date"
                            type="date"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="createdToDate"
                            value={createdToDate}
                            onChange={handleDateFilterChange}
                            InputProps={{ inputProps: { min: createdFromDate || null } }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} container justifyContent="flex-end">
                    <Stack
                        direction={{ xs: 'column-reverse', md: 'row' }}
                        spacing={2}
                        width="100%"
                        justifyContent="flex-end"
                    >
                        <SecondaryButton data-testid="reset-filter-button" onClick={() => handleResetSearchFilters()}>
                            Reset All Filters
                        </SecondaryButton>
                        <PrimaryButton
                            data-testid="search-button"
                            sx={{ marginLeft: 1 }}
                            onClick={() => handleSearch()}
                        >
                            Search
                        </PrimaryButton>
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AdvancedSearch;

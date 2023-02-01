import React, { useState } from 'react';
import {
    Grid,
    Stack,
    TextField,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { MetParagraph, MetLabel } from 'components/common';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { PrimaryButton, SecondaryButton } from '../../../common';
import dayjs from 'dayjs';
import { formatToUTC } from 'components/common/dateHelper';

interface filterParams {
    getFilterParams: (
        status_list: number[],
        created_from_date: string,
        created_to_date: string,
        published_from_date: string,
        published_to_date: string,
    ) => void;
}

const AdvancedSearch: React.FC<filterParams> = ({ getFilterParams }) => {
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

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
    const [selectedStatusList, setSelectedStatusList] = useState<number[]>([]);

    const handleStatusFilterChange = (event: React.SyntheticEvent) => {
        setStatusFilter({
            ...statusFilter,
            [(event.target as HTMLInputElement).value]: (event.target as HTMLInputElement).checked,
        });
        const id = (event.target as HTMLInputElement).id;
        setSelectedStatusList((currentParticipants: number[]) =>
            currentParticipants.includes(parseInt(id))
                ? currentParticipants.filter((f) => f !== parseInt(id))
                : [...currentParticipants, parseInt(id)],
        );
    };

    const [dateFilter, setDateFilter] = useState({
        createdFromDate: '',
        createdToDate: '',
        publishedFromDate: '',
        publishedToDate: '',
    });
    const { createdFromDate, createdToDate, publishedFromDate, publishedToDate } = dateFilter;

    const handleDateFilterChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setDateFilter({
            ...dateFilter,
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

        getFilterParams(selectedStatusList, fCreatedFromDate, fCreatedToDate, fPublishedFromDate, fPublishedToDate);
    };

    const handleResetSearchFilters = () => {
        setStatusFilter(intitialStatusList);
        setSelectedStatusList([]);

        setDateFilter({
            createdFromDate: '',
            createdToDate: '',
            publishedFromDate: '',
            publishedToDate: '',
        });

        getFilterParams([], '', '', '', '');
    };

    return (
        <>
            <Grid container direction="row" item xs={12} lg={10} mt={3} ml={2}>
                <Grid item md={3} xs={12}>
                    <Grid item xs={12}>
                        <FormLabel id="controlled-radio-buttons-group">
                            <MetLabel>Status</MetLabel>
                        </FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        id={EngagementDisplayStatus.Draft.toString()}
                                        name={EngagementDisplayStatus[EngagementDisplayStatus.Draft]}
                                        onChange={handleStatusFilterChange}
                                        value={EngagementDisplayStatus[EngagementDisplayStatus.Draft]}
                                        checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Draft]]}
                                    />
                                }
                                label={
                                    <MetParagraph>
                                        {EngagementDisplayStatus[EngagementDisplayStatus.Draft]}
                                    </MetParagraph>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        id={EngagementDisplayStatus.Scheduled.toString()}
                                        name={EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]}
                                        onChange={handleStatusFilterChange}
                                        value={EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]}
                                        checked={
                                            statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]]
                                        }
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
                                        size="small"
                                        id={EngagementDisplayStatus.Upcoming.toString()}
                                        name={EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]}
                                        onChange={handleStatusFilterChange}
                                        value={EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]}
                                        checked={
                                            statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]]
                                        }
                                    />
                                }
                                label={
                                    <MetParagraph>
                                        Published - {EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]}
                                    </MetParagraph>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        id={EngagementDisplayStatus.Open.toString()}
                                        name={EngagementDisplayStatus[EngagementDisplayStatus.Open]}
                                        onChange={handleStatusFilterChange}
                                        value={EngagementDisplayStatus[EngagementDisplayStatus.Open]}
                                        checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Open]]}
                                    />
                                }
                                label={
                                    <MetParagraph>{EngagementDisplayStatus[EngagementDisplayStatus.Open]}</MetParagraph>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        id={EngagementDisplayStatus.Closed.toString()}
                                        name={EngagementDisplayStatus[EngagementDisplayStatus.Closed]}
                                        onChange={handleStatusFilterChange}
                                        value={EngagementDisplayStatus[EngagementDisplayStatus.Closed]}
                                        checked={statusFilter[EngagementDisplayStatus[EngagementDisplayStatus.Closed]]}
                                    />
                                }
                                label={
                                    <MetParagraph>
                                        {EngagementDisplayStatus[EngagementDisplayStatus.Closed]}
                                    </MetParagraph>
                                }
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
                {!isMediumScreen ? (
                    <>
                        <Grid item md={3} xs={12}>
                            <Grid item xs={12}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Created - From</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="createdFrom-date"
                                        data-testid="createdFrom-date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="createdFromDate"
                                        value={createdFromDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { max: createdToDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} mt={3}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Published - From</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="publishedFrom-date"
                                        data-testid="publishedFrom-date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="publishedFromDate"
                                        value={publishedFromDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { max: publishedToDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Grid item xs={12}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Created - To</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="createdTo-date"
                                        data-testid="createdTo-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="createdToDate"
                                        value={createdToDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { min: createdFromDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} mt={3}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Published - To</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="publishedTo-date"
                                        data-testid="publishedTo-date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="publishedToDate"
                                        value={publishedToDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { min: publishedFromDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item md={3} xs={12}>
                            <Grid item xs={12}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Created - From</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="createdFrom-date"
                                        data-testid="createdFrom-date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="createdFromDate"
                                        value={createdFromDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { max: createdToDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Created - To</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="createdTo-date"
                                        data-testid="createdTo-date"
                                        type="date"
                                        label=" "
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="createdToDate"
                                        value={createdToDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { min: createdFromDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Grid item xs={12} mt={3}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Published - From</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="publishedFrom-date"
                                        data-testid="publishedFrom-date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="publishedFromDate"
                                        value={publishedFromDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { max: publishedToDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} mt={3}>
                                <FormLabel id="controlled-radio-buttons-group">
                                    <MetLabel>Date Published - To</MetLabel>
                                </FormLabel>
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <TextField
                                        id="publishedTo-date"
                                        data-testid="publishedTo-date"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        sx={{ width: '80%' }}
                                        name="publishedToDate"
                                        value={publishedToDate}
                                        onChange={handleDateFilterChange}
                                        InputProps={{ inputProps: { min: publishedFromDate || null } }}
                                    />
                                </Stack>
                            </Grid>
                        </Grid>
                    </>
                )}
                <Grid item md={3} xs={12}>
                    <Grid item xs={12} mt={2}>
                        <FormControlLabel
                            label={<MetParagraph>Has comments that need review</MetParagraph>}
                            control={<Checkbox disabled={true} />}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="row" item xs={12} lg={10} justifyContent="flex-end">
                <SecondaryButton data-testid="reset-filter-button" onClick={() => handleResetSearchFilters()}>
                    Reset All Filters
                </SecondaryButton>
                <PrimaryButton data-testid="search-button" sx={{ marginLeft: 1 }} onClick={() => handleSearch()}>
                    Search
                </PrimaryButton>
            </Grid>
        </>
    );
};

export default AdvancedSearch;

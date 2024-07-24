import React, { useState } from 'react';
import {
    Grid,
    Stack,
    TextField,
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormControl,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { EngagementDisplayStatus } from 'constants/engagementStatus';
import { Button } from 'components/common/Input';
import { BodyText } from 'components/common/Typography';
import { SearchOptions } from './SearchTypes';

interface filterParams {
    filterParams: SearchOptions;
    setFilterParams: (newsearchOptions: SearchOptions) => void;
}

const AdvancedSearch: React.FC<filterParams> = ({ filterParams, setFilterParams }) => {
    const isMediumScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

    const initialStatusFilters = {
        [EngagementDisplayStatus.Draft]: filterParams.status_list?.includes(EngagementDisplayStatus.Draft),
        [EngagementDisplayStatus.Scheduled]: filterParams.status_list?.includes(EngagementDisplayStatus.Scheduled),
        [EngagementDisplayStatus.Upcoming]: filterParams.status_list?.includes(EngagementDisplayStatus.Upcoming),
        [EngagementDisplayStatus.Open]: filterParams.status_list?.includes(EngagementDisplayStatus.Open),
        [EngagementDisplayStatus.Closed]: filterParams.status_list?.includes(EngagementDisplayStatus.Closed),
        [EngagementDisplayStatus.Unpublished]: filterParams.status_list?.includes(EngagementDisplayStatus.Unpublished),
    };
    const [statusFilters, setStatusFilters] = useState(initialStatusFilters);

    const handleStatusFilterChange = (event: React.SyntheticEvent) => {
        setStatusFilters({
            ...statusFilters,
            [(event.target as HTMLInputElement).name]: (event.target as HTMLInputElement).checked,
        });
    };

    const [dateFilter, setDateFilter] = useState({
        createdFromDate: filterParams.created_from_date,
        createdToDate: filterParams.created_to_date,
        publishedFromDate: filterParams.published_from_date,
        publishedToDate: filterParams.published_to_date,
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

        const selectedStatusList = Object.entries(statusFilters)
            .filter(([, value]) => value)
            .map(([key]) => Number(key));

        setFilterParams({
            status_list: selectedStatusList,
            created_from_date: createdFromDate,
            created_to_date: createdToDate,
            published_from_date: publishedFromDate,
            published_to_date: publishedToDate,
        });
    };

    const handleResetSearchFilters = () => {
        setStatusFilters(initialStatusFilters);

        setDateFilter({
            createdFromDate: '',
            createdToDate: '',
            publishedFromDate: '',
            publishedToDate: '',
        });
        // reset the search params to empty also invoke the list to reload
        setFilterParams({
            status_list: [],
            created_from_date: '',
            created_to_date: '',
            published_from_date: '',
            published_to_date: '',
        });
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
                    <BodyText bold>Status</BodyText>
                    <FormGroup row={isMediumScreen}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Draft.toString()}
                                    data-testid={EngagementDisplayStatus.Draft.toString()}
                                    name={EngagementDisplayStatus.Draft.toString()}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilters[EngagementDisplayStatus.Draft]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<BodyText>{EngagementDisplayStatus[EngagementDisplayStatus.Draft]}</BodyText>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Scheduled.toString()}
                                    data-testid={EngagementDisplayStatus.Scheduled.toString()}
                                    name={EngagementDisplayStatus.Scheduled.toString()}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilters[EngagementDisplayStatus.Scheduled]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<BodyText>{EngagementDisplayStatus[EngagementDisplayStatus.Scheduled]}</BodyText>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Upcoming.toString()}
                                    data-testid={EngagementDisplayStatus.Upcoming.toString()}
                                    name={EngagementDisplayStatus.Upcoming.toString()}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilters[EngagementDisplayStatus.Upcoming]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<BodyText>{EngagementDisplayStatus[EngagementDisplayStatus.Upcoming]}</BodyText>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Open.toString()}
                                    data-testid={EngagementDisplayStatus.Open.toString()}
                                    name={EngagementDisplayStatus.Open.toString()}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilters[EngagementDisplayStatus.Open]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<BodyText>{EngagementDisplayStatus[EngagementDisplayStatus.Open]}</BodyText>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Closed.toString()}
                                    data-testid={EngagementDisplayStatus.Closed.toString()}
                                    name={EngagementDisplayStatus.Closed.toString()}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilters[EngagementDisplayStatus.Closed]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<BodyText>{EngagementDisplayStatus[EngagementDisplayStatus.Closed]}</BodyText>}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id={EngagementDisplayStatus.Unpublished.toString()}
                                    data-testid={EngagementDisplayStatus.Unpublished.toString()}
                                    name={EngagementDisplayStatus.Unpublished.toString()}
                                    onChange={handleStatusFilterChange}
                                    checked={statusFilters[EngagementDisplayStatus.Unpublished]}
                                    sx={{
                                        height: 30,
                                    }}
                                />
                            }
                            label={<BodyText>{EngagementDisplayStatus[EngagementDisplayStatus.Unpublished]}</BodyText>}
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
                        <BodyText bold>Date Created - From</BodyText>
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
                        <BodyText bold>Date Created - To</BodyText>
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
                        <BodyText bold>Date Published - From</BodyText>
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
                        <BodyText bold>Date Published - To</BodyText>
                        <TextField
                            id="publishedTo-date"
                            data-testid="publishedTo-date"
                            type="date"
                            label=" "
                            InputLabelProps={{
                                shrink: false,
                            }}
                            fullWidth
                            name="publishedToDate"
                            value={publishedToDate}
                            onChange={handleDateFilterChange}
                            InputProps={{ inputProps: { min: publishedFromDate || null } }}
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
                        <Button
                            size="small"
                            data-testid="reset-filter-button"
                            onClick={() => handleResetSearchFilters()}
                        >
                            Reset All Filters
                        </Button>
                        <Button
                            size="small"
                            variant="primary"
                            data-testid="search-button"
                            sx={{ marginLeft: 1 }}
                            onClick={() => handleSearch()}
                        >
                            Search
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AdvancedSearch;

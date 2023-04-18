import React, { useState } from 'react';
import { Grid, MenuItem, Stack, TextField } from '@mui/material';
import { MetLabel, PrimaryButton, SecondaryButton } from 'components/common';
import { COMMENTS_STATUS, CommentStatus } from 'constants/commentStatus';
import { AdvancedSearchFilters, CommentListingContext, initialSearchFilters } from './CommentListingContext';

export const AdvancedSearch = () => {
    const { advancedSearchFilters, setAdvancedSearchFilters } = React.useContext(CommentListingContext);
    const [searchFilters, setSearchFilters] = useState<AdvancedSearchFilters>(advancedSearchFilters);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSearchFilters({ ...searchFilters, [name]: value });
    };

    const { status, commentDateFrom, commentDateTo, reviewer, reviewedDateFrom, reviewedDateTo } = searchFilters;

    return (
        <Grid
            container
            direction="row"
            alignItems={'flex-start'}
            justifyContent={'flex-start'}
            spacing={2}
            mt={{ md: 2 }}
        >
            <Grid
                container
                direction="row"
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={2}
                item
                xs={12}
                lg={10}
            >
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <MetLabel>Status</MetLabel>
                    <TextField
                        id="status"
                        name="status"
                        variant="outlined"
                        label=" "
                        defaultValue=""
                        value={status || 0}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        select
                        InputLabelProps={{
                            shrink: false,
                        }}
                    >
                        <MenuItem value={0} sx={{ fontStyle: 'italic', height: '2em' }}>
                            {''}
                        </MenuItem>
                        <MenuItem value={CommentStatus.Approved}>{COMMENTS_STATUS[CommentStatus.Approved]}</MenuItem>
                        <MenuItem value={CommentStatus.Rejected}>{COMMENTS_STATUS[CommentStatus.Rejected]}</MenuItem>
                        <MenuItem value={CommentStatus.Pending}>{COMMENTS_STATUS[CommentStatus.Pending]}</MenuItem>
                        <MenuItem value={CommentStatus.NeedsFurtherReview}>
                            {COMMENTS_STATUS[CommentStatus.NeedsFurtherReview]}
                        </MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <MetLabel>Filter by Comment Date - From</MetLabel>
                    <TextField
                        name="commentDateFrom"
                        type="date"
                        variant="outlined"
                        label=" "
                        value={commentDateFrom}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <MetLabel>Filter by Comment Date - To</MetLabel>
                    <TextField
                        name="commentDateTo"
                        type="date"
                        variant="outlined"
                        label=" "
                        value={commentDateTo}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                direction="row"
                alignItems={'flex-start'}
                justifyContent={'flex-start'}
                spacing={2}
                item
                xs={12}
                lg={10}
            >
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <MetLabel>Reviewer</MetLabel>
                    <TextField
                        name="reviewer"
                        variant="outlined"
                        label=" "
                        InputLabelProps={{
                            shrink: false,
                        }}
                        fullWidth
                        value={reviewer}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <MetLabel>Filter by Reviewed Date - From</MetLabel>
                    <TextField
                        name="reviewedDateFrom"
                        type="date"
                        variant="outlined"
                        label=" "
                        value={reviewedDateFrom}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <MetLabel>Filter by Reviewed Date - To</MetLabel>
                    <TextField
                        name="reviewedDateTo"
                        type="date"
                        variant="outlined"
                        label=" "
                        value={reviewedDateTo}
                        fullWidth
                        size="small"
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: false,
                        }}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end" direction="row">
                <Stack
                    direction={{ sm: 'column-reverse', lg: 'row' }}
                    spacing={1}
                    width="100%"
                    justifyContent="flex-end"
                >
                    <SecondaryButton
                        size="small"
                        onClick={() => {
                            setAdvancedSearchFilters(initialSearchFilters);
                            setSearchFilters(initialSearchFilters);
                        }}
                    >
                        Reset All Filters
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={() => {
                            setAdvancedSearchFilters(searchFilters);
                        }}
                    >
                        Search
                    </PrimaryButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

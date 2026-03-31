import React, { useState } from 'react';
import { Grid2 as Grid, MenuItem, Stack, TextField } from '@mui/material';
import { BodyText } from 'components/common/Typography/Body';
import { Button } from 'components/common/Input/Button';
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
                size={{ xs: 12, lg: 10 }}
            >
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <BodyText bold>Status</BodyText>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <BodyText bold>Comment Date - From</BodyText>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <BodyText bold>Comment Date - To</BodyText>
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
                size={{ xs: 12, lg: 10 }}
            >
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <BodyText bold>Reviewer</BodyText>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <BodyText bold>Review Date - From</BodyText>
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
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <BodyText bold>Review Date - To</BodyText>
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
            <Grid size={12} container justifyContent="flex-end" direction="row">
                <Stack
                    direction={{ sm: 'column-reverse', lg: 'row' }}
                    spacing={1}
                    width="100%"
                    justifyContent="flex-end"
                >
                    <Button
                        onClick={() => {
                            setAdvancedSearchFilters(initialSearchFilters);
                            setSearchFilters(initialSearchFilters);
                        }}
                    >
                        Reset All Filters
                    </Button>
                    <Button
                        variant="primary"
                        data-testid="advanced-search-button"
                        onClick={() => {
                            setAdvancedSearchFilters(searchFilters);
                        }}
                    >
                        Search
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};

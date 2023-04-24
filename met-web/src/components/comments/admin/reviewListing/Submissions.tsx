import React, { useState, useContext } from 'react';
import MetTable from 'components/common/Table';
import Grid from '@mui/material/Grid';
import { Link, useLocation } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, MetHeader1, SecondaryButton } from 'components/common';
import { HeadCell, PaginationOptions } from 'components/common/Table/types';
import { formatDate, formatToUTC } from 'components/common/dateHelper';
import { Collapse, Link as MuiLink } from '@mui/material';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import { SurveySubmission } from 'models/surveySubmission';
import { COMMENTS_STATUS, CommentStatus } from 'constants/commentStatus';
import { getCommentsSheet } from 'services/commentService';
import { downloadFile } from 'utils';
import { AdvancedSearch } from './AdvancedSearch';
import { CommentListingContext } from './CommentListingContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Submissions = () => {
    const {
        searchFilter,
        setSearchFilter,
        searchText,
        setSearchText,
        survey,
        submissions,
        paginationOptions,
        setPagination,
        pageInfo,
        loading,
    } = useContext(CommentListingContext);
    const { state } = useLocation();
    const [isExporting, setIsExporting] = useState(false);
    const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(Boolean(state));

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
    };

    const handleExportComments = async () => {
        setIsExporting(true);
        const response = await getCommentsSheet({ survey_id: survey.id });
        downloadFile(response, `${survey.engagement?.name || ''} - ${formatToUTC(Date())}.csv`);
        setIsExporting(false);
    };

    const headCells: HeadCell<SurveySubmission>[] = [
        {
            key: 'id',
            nestedSortKey: 'submission.id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            getValue: (row) => (
                <MuiLink component={Link} to={`/surveys/${Number(row.survey_id)}/submissions/${row.id}/review`}>
                    {row.id}
                </MuiLink>
            ),
        },
        {
            key: 'created_date',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            getValue: (row) => formatDate(row.created_date || ''),
        },
        {
            key: 'reviewed_by',
            numeric: true,
            disablePadding: false,
            label: 'Reviewed By',
            allowSort: true,
            getValue: (row) => row.reviewed_by,
        },
        {
            key: 'review_date',
            numeric: true,
            disablePadding: false,
            label: 'Date Reviewed',
            allowSort: true,
            getValue: (row) => formatDate(row.review_date || ''),
        },
        {
            key: 'comment_status_id',
            numeric: false,
            disablePadding: true,
            label: 'Status',
            allowSort: true,
            getValue: (row) => COMMENTS_STATUS[row.comment_status_id as CommentStatus] || '',
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            rowSpacing={1}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} width="100%" justifyContent="space-between">
                <Stack direction="row" spacing={1}>
                    <TextField
                        id="comments"
                        variant="outlined"
                        label="Search Comments"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size="small"
                    />
                    <PrimaryButton
                        data-testid="CommentListing/search-button"
                        onClick={() => handleSearchBarClick(searchText)}
                    >
                        <SearchIcon />
                    </PrimaryButton>
                    <SecondaryButton
                        data-testid="comment-listing/advanced-search-button"
                        onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                        startIcon={
                            <ExpandMoreIcon
                                sx={{
                                    transition: (theme) =>
                                        theme.transitions.create('transform', {
                                            duration: theme.transitions.duration.shortest,
                                        }),
                                    transform: isAdvancedSearchOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                            />
                        }
                    >
                        Advanced Search
                    </SecondaryButton>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <PrimaryButton component={Link} to={`/surveys/${survey.id}/comments/all`}>
                        Read All Comments
                    </PrimaryButton>
                    <SecondaryButton onClick={handleExportComments} loading={isExporting}>
                        Export to CSV
                    </SecondaryButton>
                </Stack>
            </Stack>

            <Grid item xs={12}>
                <Collapse in={isAdvancedSearchOpen}>
                    <AdvancedSearch />
                </Collapse>
            </Grid>

            <Grid item xs={12}>
                <MetHeader1>
                    <strong>{`${survey.name} Comments`}</strong>
                </MetHeader1>
                <MetTable
                    headCells={headCells}
                    rows={submissions}
                    handleChangePagination={(pagination: PaginationOptions<SurveySubmission>) =>
                        setPagination(pagination)
                    }
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={loading}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default Submissions;

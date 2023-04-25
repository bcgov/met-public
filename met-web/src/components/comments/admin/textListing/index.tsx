import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link, useParams } from 'react-router-dom';
import { MetPageGridContainer, PrimaryButton, MetParagraph, MetLabel } from 'components/common';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { Link as MuiLink, Grid, Stack, TextField, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';
import { CommentStatusChip } from '../../status';
import { CommentStatus } from 'constants/commentStatus';
import { When } from 'react-if';
import { getSubmissionPage } from 'services/submissionService';
import { SurveySubmission } from 'models/surveySubmission';
import { formatDate } from 'components/common/dateHelper';

const CommentTextListing = () => {
    const [searchFilter, setSearchFilter] = useState({
        key: 'text',
        value: '',
    });
    const [searchText, setSearchText] = useState('');
    const [paginationOptions, setPagination] = useState<PaginationOptions<SurveySubmission>>({
        page: 1,
        size: 10,
        sort_key: 'id',
        nested_sort_key: 'submission.id',
        sort_order: 'desc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
    });
    const [tableLoading, setTableLoading] = useState(true);

    const dispatch = useAppDispatch();
    const { surveyId } = useParams();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
    const loadSubmissions = async () => {
        try {
            setTableLoading(true);
            const queryParams = {
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                search_text: searchFilter.value,
            };
            const response = await getSubmissionPage({
                survey_id: Number(surveyId),
                queryParams,
            });
            setSubmissions(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching submissions' }));
            setTableLoading(false);
        }
    };

    useEffect(() => {
        loadSubmissions();
    }, [paginationOptions, surveyId, searchFilter]);

    const handleSearchBarClick = (filter: string) => {
        setSearchFilter({
            ...searchFilter,
            value: filter,
        });
    };

    const headCells: HeadCell<SurveySubmission>[] = [
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            renderCell: (row: SurveySubmission) => (
                <MuiLink component={Link} to={`/surveys/${Number(row.survey_id)}/submissions/${row.id}/review`}>
                    {row.id}
                </MuiLink>
            ),
        },
        {
            key: 'comments',
            numeric: true,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            renderCell: (row: SurveySubmission) => (
                <Grid container rowSpacing={2} sx={{ pt: 1.5 }}>
                    {row.comments?.map((comment, index) => {
                        return (
                            <Grid key={index} item xs={12}>
                                <Grid xs={12} item>
                                    <MetLabel>{comment.label ?? 'Label not available.'} </MetLabel>
                                    <MetParagraph>{' ' + comment.text}</MetParagraph>
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            ),
        },
        {
            key: 'comment_status_id',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            renderCell: (row: SurveySubmission) => (
                <Grid container>
                    <Grid container item xs={12} sx={{ pb: '0.5em' }}>
                        <Grid
                            item
                            lg={3}
                            md={5}
                            xs={6}
                            alignItems={'flex-end'}
                            justifyContent={'flex-end'}
                            sx={{ mr: 1 }}
                        >
                            <MetParagraph
                                sx={{
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    alignSelf: 'flex-end',
                                    pb: '0.5em',
                                }}
                            >
                                <b>Comment Date: </b>
                            </MetParagraph>
                        </Grid>
                        <Grid item lg={8} md={6} xs={6}>
                            <MetParagraph>{formatDate(row.created_date)}</MetParagraph>
                        </Grid>
                        <When condition={row.comment_status_id !== CommentStatus.Pending}>
                            <Grid
                                item
                                lg={3}
                                md={5}
                                xs={6}
                                alignItems={'flex-end'}
                                justifyContent={'flex-end'}
                                sx={{ mr: 1 }}
                            >
                                <MetParagraph>
                                    <b>Reviewed By: </b>
                                </MetParagraph>
                            </Grid>
                            <Grid item lg={8} md={6} xs={6}>
                                <MetParagraph>{row.reviewed_by}</MetParagraph>
                            </Grid>
                        </When>
                    </Grid>
                    <Grid item lg={3} md={5} xs={6} sx={{ mr: 1 }}></Grid>
                    <Grid item lg={8} md={6} xs={6}>
                        <CommentStatusChip commentStatus={row.comment_status_id} />
                    </Grid>
                </Grid>
            ),
        },
    ];

    return (
        <MetPageGridContainer
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            container
            columnSpacing={2}
            rowSpacing={1}
        >
            <Grid item xs={12} container>
                <Grid item xs={12} lg={4}>
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
                    </Stack>
                </Grid>
            </Grid>
            <Grid item sm={12} lg={10}>
                <MetTable
                    hideHeader={true}
                    headCells={headCells}
                    rows={submissions}
                    handleChangePagination={(pagination: PaginationOptions<SurveySubmission>) =>
                        setPagination(pagination)
                    }
                    commentTable
                    paginationOptions={paginationOptions}
                    pageInfo={pageInfo}
                    loading={tableLoading}
                />
                <PrimaryButton component={Link} to={`/surveys/${submissions[0]?.survey_id || 0}/comments`}>
                    Return to Comments List
                </PrimaryButton>
            </Grid>
        </MetPageGridContainer>
    );
};

export default CommentTextListing;

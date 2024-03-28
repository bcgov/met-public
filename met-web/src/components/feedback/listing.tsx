import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { MetPageGridContainer, PrimaryButton } from 'components/common';
import { CommentTypeEnum, Feedback, FeedbackStatusEnum, SourceTypeEnum } from 'models/feedback';
import { useAppDispatch, useAppSelector } from 'hooks';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import Stack from '@mui/material/Stack';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetTable from 'components/common/Table';
import { getFeedbacksPage } from 'services/feedbackService';
import { formatDate } from 'components/common/dateHelper';
import { customRatings } from 'components/feedback/FeedbackModal/constants';
import { useLocation } from 'react-router-dom';
import { updateURLWithPagination } from 'components/common/Table/utils';
import { ActionsDropDown } from './actionDropdown';
import { USER_ROLES } from 'services/userService/constants';
import { When } from 'react-if';
const FeedbackListing = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const { roles } = useAppSelector((state) => state.user);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageFromURL = searchParams.get('page');
    const sizeFromURL = searchParams.get('size');
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Feedback>>({
        page: Number(pageFromURL) || 1,
        size: Number(sizeFromURL) || 10,
        sort_key: 'rating',
        nested_sort_key: null,
        sort_order: 'asc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [tableLoading, setTableLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(FeedbackStatusEnum.NotReviewed);
    const authorized = roles.includes(USER_ROLES.CREATE_ADMIN_USER);
    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    useEffect(() => {
        loadFeedbacks();
        updateURLWithPagination(paginationOptions);
    }, [paginationOptions]);

    useEffect(() => {
        loadFeedbacks();
    }, [authorized]);

    const loadFeedbacks = async () => {
        try {
            setTableLoading(true);
            const response = await getFeedbacksPage({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
                status: statusFilter,
            });
            setFeedbacks(response.items);
            setPageInfo({
                total: response.total,
            });
            setTableLoading(false);
        } catch (error) {
            console.log(error);
            dispatch(
                openNotification({
                    severity: 'error',
                    text: 'Error occurred while trying to fetch feedbacks, please refresh the page or try again at a later time',
                }),
            );
            setTableLoading(false);
        }
    };

    const headCells: HeadCell<Feedback>[] = [
        {
            key: 'rating',
            numeric: true,
            disablePadding: true,
            label: 'Feedback',
            allowSort: true,
            renderCell: (row: Feedback) => customRatings[row.rating].icon,
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            renderCell: (row: Feedback) => formatDate(row.created_date),
        },
        {
            key: 'source',
            numeric: false,
            disablePadding: false,
            label: 'Source',
            allowSort: true,
            renderCell: (row: Feedback) => SourceTypeEnum[row.source ?? 0].toString(),
        },
        {
            key: 'submission_path',
            numeric: false,
            disablePadding: false,
            label: 'Path',
            allowSort: true,
            renderCell: (row: Feedback) => row.submission_path,
        },
        {
            key: 'comment_type',
            numeric: false,
            disablePadding: false,
            label: 'Feedback Type',
            allowSort: true,
            renderCell: (row: Feedback) => CommentTypeEnum[row.comment_type].toString(),
        },
        {
            key: 'comment',
            numeric: false,
            disablePadding: false,
            label: 'Message',
            allowSort: true,
            renderCell: (row: Feedback) => row.comment,
        },
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'Actions',
            allowSort: false,
            renderCell: (row: Feedback) => {
                return <ActionsDropDown reload={() => loadFeedbacks()} feedback={row} />;
            },
            customStyle: {
                minWidth: '200px',
            },
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
            <Grid item xs={12}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    width="100%"
                    justifyContent="flex-end"
                    sx={{ p: 2 }}
                >
                    <When condition={authorized}>
                        <PrimaryButton
                            onClick={() => {
                                setPaginationOptions({
                                    page: 1,
                                    size: 10,
                                    sort_key: 'rating',
                                    nested_sort_key: null,
                                    sort_order: 'asc',
                                });
                                setStatusFilter(
                                    statusFilter == FeedbackStatusEnum.NotReviewed
                                        ? FeedbackStatusEnum.Archived
                                        : FeedbackStatusEnum.NotReviewed,
                                );
                            }}
                        >
                            {statusFilter == FeedbackStatusEnum.NotReviewed ? 'View Archive' : 'View Feedback'}
                        </PrimaryButton>
                    </When>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <MetTable
                    headCells={headCells}
                    rows={feedbacks}
                    handleChangePagination={(paginationOptions: PaginationOptions<Feedback>) =>
                        setPaginationOptions(paginationOptions)
                    }
                    paginationOptions={paginationOptions}
                    loading={tableLoading}
                    pageInfo={pageInfo}
                />
            </Grid>
        </MetPageGridContainer>
    );
};

export default FeedbackListing;

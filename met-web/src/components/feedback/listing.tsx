import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';
import { MetPageGridContainer } from 'components/common';
import { CommentTypeEnum, Feedback, SourceTypeEnum } from 'models/feedback';
import { useAppDispatch } from 'hooks';
import { createDefaultPageInfo, HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { ReactComponent as VeryDissatisfiedIcon } from 'assets/images/emojiVeryDissatisfied.svg';
import { ReactComponent as DissatisfiedIcon } from 'assets/images/emojiDissatisfied.svg';
import { ReactComponent as NeutralIcon } from 'assets/images/emojiNeutral.svg';
import { ReactComponent as SatisfiedIcon } from 'assets/images/emojiSatisfied.svg';
import { ReactComponent as VerySatisfiedIcon } from 'assets/images/emojiVerySatisfied.svg';
import Stack from '@mui/material/Stack';
import { openNotification } from 'services/notificationService/notificationSlice';
import MetTable from 'components/common/Table';
import { getFeedbacksPage } from 'services/feedbackService';
import { formatDate } from 'components/common/dateHelper';

const customRatings: {
    [index: number]: {
        icon: React.ReactElement;
        label: string;
    };
} = {
    5: {
        icon: <SvgIcon fontSize="large" component={VeryDissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Very Dissatisfied',
    },
    4: {
        icon: <SvgIcon fontSize="large" component={DissatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SvgIcon fontSize="large" component={NeutralIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Neutral',
    },
    2: {
        icon: <SvgIcon fontSize="large" component={SatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Satisfied',
    },
    1: {
        icon: <SvgIcon fontSize="large" component={VerySatisfiedIcon} viewBox="0 0 64 64" sx={{ marginX: 1 }} />,
        label: 'Very Satisfied',
    },
    0: {
        icon: <></>,
        label: '',
    },
};

const FeedbackListing = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Feedback>>({
        page: 1,
        size: 10,
        sort_key: 'rating',
        nested_sort_key: null,
        sort_order: 'asc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>(createDefaultPageInfo());
    const [tableLoading, setTableLoading] = useState(true);
    const dispatch = useAppDispatch();

    const { page, size, sort_key, nested_sort_key, sort_order } = paginationOptions;

    useEffect(() => {
        loadFeedbacks();
    }, [paginationOptions]);

    const loadFeedbacks = async () => {
        try {
            setTableLoading(true);
            const response = await getFeedbacksPage({
                page,
                size,
                sort_key: nested_sort_key || sort_key,
                sort_order,
            });
            setFeedbacks(response.items);
            setPageInfo({
                total: feedbacks.length,
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
            getValue: (row: Feedback) => customRatings[row.rating].icon,
        },
        {
            key: 'created_date',
            numeric: false,
            disablePadding: false,
            label: 'Date Published',
            allowSort: true,
            getValue: (row: Feedback) => formatDate(row.created_date),
        },
        {
            key: 'source',
            numeric: false,
            disablePadding: false,
            label: 'Source',
            allowSort: true,
            getValue: (row: Feedback) => SourceTypeEnum[row.source ?? 0].toString(),
        },
        {
            key: 'comment_type',
            numeric: false,
            disablePadding: false,
            label: 'Feedback Type',
            allowSort: true,
            getValue: (row: Feedback) => CommentTypeEnum[row.comment_type].toString(),
        },
        {
            key: 'comment',
            numeric: false,
            disablePadding: false,
            label: 'Message',
            allowSort: true,
            getValue: (row: Feedback) => row.comment,
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
            <Grid item xs={12} lg={10}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={1}
                    width="100%"
                    justifyContent="flex-end"
                    sx={{ p: 2 }}
                ></Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <div data-testid="feedback-listing-table">
                    <MetTable
                        data-testid="feedback-listing-table"
                        headCells={headCells}
                        rows={feedbacks}
                        noRowBorder={true}
                        handleChangePagination={(paginationOptions: PaginationOptions<Feedback>) =>
                            setPaginationOptions(paginationOptions)
                        }
                        paginationOptions={paginationOptions}
                        loading={tableLoading}
                        pageInfo={pageInfo}
                    />
                </div>
            </Grid>
        </MetPageGridContainer>
    );
};

export default FeedbackListing;

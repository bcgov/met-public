import React, { useContext, useState } from 'react';
import MetTable from 'components/common/Table';
import { Comment } from 'models/comment';
import { HeadCell, PageInfo, PaginationOptions } from 'components/common/Table/types';
import { Skeleton, Typography } from '@mui/material';
import { CommentViewContext } from './CommentViewContext';

const CommentTable = () => {
    const { isCommentsListLoading, comments } = useContext(CommentViewContext);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [paginationOptions, setPaginationOptions] = useState<PaginationOptions<Comment>>({
        page: 0,
        size: 10,
        sort_key: 'id',
        sort_order: 'asc',
    });
    const [pageInfo, setPageInfo] = useState<PageInfo>({
        total: 0,
    });

    const headCells: HeadCell<Comment>[] = [
        {
            key: 'text',
            numeric: false,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            getValue: (row: Comment) => row.text,
        },
        {
            key: 'submission_date',
            numeric: false,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: false,
            customStyle: { width: '20%' },
            align: 'right',
            getValue: (row: Comment) => <Typography variant="subtitle2">{row.submission_date}</Typography>,
        },
    ];

    if (isCommentsListLoading) {
        return <Skeleton variant="rectangular" width="100%" height="60m" />;
    }

    return (
        <>
            {/* <MetTable
                rows={comments}
                headCells={headCells}
                hideHeader={true}
                handlePageChange={(newPage: number) => setPage(newPage)}
                handleSizeChange={(newSize: number) => setSize(newSize)}
                handleChangePagination={(pagination: PaginationOptions<Comment>) => setPaginationOptions(pagination)}
                paginationOptions={paginationOptions}
            /> */}

            <MetTable
                headCells={headCells}
                rows={comments}
                noRowBorder={true}
                hideHeader={true}
                handleChangePagination={(paginationOptions: PaginationOptions<Comment>) =>
                    setPaginationOptions(paginationOptions)
                }
                paginationOptions={paginationOptions}
                pageInfo={pageInfo}
            />
        </>
    );
};

export default CommentTable;

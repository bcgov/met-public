import React, { useContext } from 'react';
import MetTable from 'components/common/Table';
import { HeadCell } from 'components/common/Table/types';
import { MetLabel, MetParagraph } from 'components/common';
import { Skeleton } from '@mui/material';
import { CommentViewContext, TransformedComment } from './CommentViewContext';
import { useAppTranslation } from 'hooks';

export interface CommentType {
    label: string;
    submission_date: string;
    submission_id: number;
    text: string;
}

const CommentTable = () => {
    const { t: translate } = useAppTranslation();
    const { isCommentsListLoading, comments, paginationOptions, pageInfo, handleChangePagination, tableLoading } =
        useContext(CommentViewContext);

    const transformedArray: TransformedComment[] = comments.reduce((acc: TransformedComment[], comment) => {
        const existingSubmission = acc.find((submission) => submission.submission_id === comment.submission_id);

        if (existingSubmission) {
            existingSubmission.comments.push({ label: comment.label, text: comment.text });
        } else {
            acc.push({
                submission_id: comment.submission_id,
                submission_date: comment.submission_date,
                comments: [{ label: comment.label, text: comment.text }],
            });
        }

        return acc;
    }, []);

    // Sort transformedArray in descending order based on submission_id
    transformedArray.sort((a, b) => b.submission_id - a.submission_id);

    const headCells: HeadCell<TransformedComment>[] = [
        {
            key: 'comments',
            numeric: false,
            disablePadding: false,
            label: translate('commentDashboard.table.label.0'),
            allowSort: false,
            customStyle: { width: '80%' },
            align: 'left',
            renderCell: (row: TransformedComment) => (
                <>
                    {row.comments.map((comment) => (
                        <div style={{ paddingTop: '10px' }} key={comment.label}>
                            <MetLabel>{comment.label}</MetLabel>
                            <div style={{ paddingTop: '5px' }}>
                                <MetParagraph>{comment.text}</MetParagraph>
                            </div>
                        </div>
                    ))}
                </>
            ),
        },
        {
            key: 'submission_date',
            numeric: false,
            disablePadding: false,
            label: translate('commentDashboard.table.label.1'),
            allowSort: false,
            customStyle: { width: '20%' },
            align: 'right',
            renderCell: (row: TransformedComment) => <MetParagraph>{row.submission_date}</MetParagraph>,
        },
    ];

    if (isCommentsListLoading) {
        return <Skeleton variant="rectangular" width="100%" height="60m" />;
    }

    return (
        <>
            <MetTable
                headCells={headCells}
                rows={transformedArray}
                hideHeader={true}
                handleChangePagination={handleChangePagination}
                paginationOptions={paginationOptions}
                pageInfo={pageInfo}
                loading={tableLoading}
                emptyText={translate('commentDashboard.table.emptyText')}
            />
        </>
    );
};

export default CommentTable;

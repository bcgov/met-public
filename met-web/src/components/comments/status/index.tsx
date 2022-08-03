import React from 'react';
import { Chip } from '@mui/material';
import { CommentStatus } from 'constants/commentStatus';

const Accepted = () => {
    return <Chip label="Accepted" color="success" sx={{ fontWeight: 500 }} />;
};

const Rejected = () => {
    return <Chip label="Rejected" color="error" sx={{ fontWeight: 500 }} />;
};

const Pending = () => {
    return <Chip label="Pending" sx={{ fontWeight: 500, backgroundColor: '#FFC107', color: 'black' }} />;
};

export const CommentStatusChip = ({ commentStatus }: { commentStatus: CommentStatus }) => {
    switch (commentStatus) {
        case CommentStatus.Pending:
            return <Pending />;
        case CommentStatus.Accepted:
            return <Accepted />;
        case CommentStatus.Rejected:
            return <Rejected />;
        default:
            return null;
    }
};

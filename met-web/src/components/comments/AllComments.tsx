import React, { useState, useEffect } from 'react';
import MetTable from 'components/common/Table';
import { Link } from 'react-router-dom';
import { MetPageGridContainer } from 'components/common';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { Link as MuiLink, Typography, Box, Button, Grid } from '@mui/material';
import { useAppDispatch } from 'hooks';
import { openNotification } from 'services/notificationService/notificationSlice';

const testComments: Comment[] = [
    {
        id: 0,
        survey_id: 1,
        email: '@gmail.com',
        comment_date: '2022-04-15',
        published_date: '2022-04-16',
        status: 'Pending',
        content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        reviewed_by: 'Jimmy',
        date_reviewed: '2022-04-16',
    },
    {
        id: 1,
        survey_id: 1,
        email: '@gmail.com',
        comment_date: '2022-04-15',
        published_date: '2022-04-16',
        status: 'Pending',
        content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        reviewed_by: 'Bill',
        date_reviewed: '2022-04-16',
    },
    {
        id: 2,
        survey_id: 1,
        email: '@gmail.com',
        comment_date: '2022-04-15',
        published_date: '2022-04-16',
        status: 'Pending',
        content:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        reviewed_by: 'Robert',
        date_reviewed: '2022-04-16',
    },
];

const AllComments = () => {
    const [comments, setComments] = useState<Comment[]>([]);

    const dispatch = useAppDispatch();

    const callFetchComments = async () => {
        try {
            const fetchedComments = testComments;
            setComments(fetchedComments);
        } catch (error) {
            dispatch(openNotification({ severity: 'error', text: 'Error occurred while fetching comments' }));
        }
    };

    useEffect(() => {
        callFetchComments();
    }, []);

    const headCells: HeadCell<Comment>[] = [
        {
            key: 'id',
            numeric: true,
            disablePadding: false,
            label: 'ID',
            allowSort: true,
            getValue: (row: Comment) => (
                <MuiLink component={Link} to={`/survey/${Number(row.survey_id)}/comments/${row.id}`}>
                    {row.id}
                </MuiLink>
            ),
        },
        {
            key: 'content',
            numeric: true,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            getValue: (row: Comment) => row.content,
        },
        {
            key: 'comment_date',
            numeric: true,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: true,
            getValue: (row: Comment) => (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '16px' }}>
                            <b>Comment Date: </b>
                            {row.comment_date}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography sx={{ fontSize: '16px' }}>
                            <b>Reviewed By: </b> {row.reviewed_by}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}>
                        {row.status != 'Approved' ? (
                            <Box
                                style={{
                                    fontWeight: 'bold',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'green',
                                    borderRadius: '40px',
                                    color: 'white',
                                    display: 'flex',
                                    fontSize: '14px',
                                    padding: '5px',
                                }}
                            >
                                Approved
                            </Box>
                        ) : (
                            <Box
                                style={{
                                    fontWeight: 'bold',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'red',
                                    borderRadius: '40px',
                                    color: 'white',
                                    display: 'flex',
                                    fontSize: '14px',
                                    padding: '5px',
                                }}
                            >
                                Rejected
                            </Box>
                        )}
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
            <Grid item xs={12} lg={10}>
                <MetTable hideHeader={true} headCells={headCells} rows={comments} defaultSort={'id'} />
                <Button variant="contained">Return to Comments List</Button>
            </Grid>
        </MetPageGridContainer>
    );
};

export default AllComments;

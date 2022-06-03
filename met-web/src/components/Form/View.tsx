import React, { useEffect } from 'react';
import './Form.scss';
import { getForm, selectRoot, Form, saveSubmission, resetSubmissions } from '@formio/react';
import { CircularProgress, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FORM_ID } from '../../constants/constants';

const View = () => {
    const dispatch = useDispatch();
    const { form, isActive } = useSelector((state) => selectRoot('form', state));

    const { submission, url } = useSelector((state) => selectRoot('submission', state));

    useEffect(() => {
        dispatch(getForm('form', FORM_ID));
    }, [dispatch]);

    const onSubmit = (submissionToSave: any) => {
        dispatch(
            saveSubmission('submission', submissionToSave, FORM_ID, (err: any, sentSubmission: any) => {
                if (!err) {
                    dispatch(resetSubmissions('submission'));
                }
            }),
        );
    };

    if (isActive) {
        return <CircularProgress />;
    }

<<<<<<< Updated upstream
    return (
        <Container className="formioStyle">
            <Form form={form} url={url} onSubmit={onSubmit} submission={submission} />
        </Container>
    );
=======
    return <Form className="FormIO" form={form} url={url} onSubmit={onSubmit} submission={submission} />;
>>>>>>> Stashed changes
};

export default View;

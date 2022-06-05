/* eslint-disable */
import React, { useEffect } from 'react';
import './Form.scss';
import { getForm, selectRoot, Form, saveSubmission, resetSubmissions } from '@formio/react';
import { CircularProgress } from '@mui/material';
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


    return <Form className="FormIO" form={form} url={url} onSubmit={onSubmit} submission={submission} />;

};

export default View;

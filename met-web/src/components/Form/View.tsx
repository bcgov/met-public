/* eslint-disable */
import React, { useEffect } from 'react';
import { getForm, selectRoot, Form, saveSubmission, resetSubmissions } from '@formio/react';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfig } from '../../config';

const View = () => {
    const dispatch = useDispatch();
    const { form, isActive } = useSelector((state) => selectRoot('form', state));

    const { submission, url } = useSelector((state) => selectRoot('submission', state));

    useEffect(() => {
        dispatch(getForm('form', AppConfig.formio.formId));
    }, [dispatch]);

    const onSubmit = (submissionToSave: any) => {
        dispatch(
            saveSubmission('submission', submissionToSave, AppConfig.formio.formId, (err: any, sentSubmission: any) => {
                if (!err) {
                    dispatch(resetSubmissions('submission'));
                }
            }),
        );
    };

    if (isActive) {
        return <CircularProgress />;
    }


    return <Form form={form} url={url} onSubmit={onSubmit} submission={submission} />;

};

export default View;

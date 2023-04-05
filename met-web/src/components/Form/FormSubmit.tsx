/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';
import ProgressBar from 'components/survey/submit/FormProgressBar';

const FormSubmit = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    const [formioInstance, setFormioInstance] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (formioInstance) {
            const updateProgressBar = () => {
                setCurrentPage(formioInstance.page);
            };

            formioInstance.on('nextPage', updateProgressBar);
            formioInstance.on('prevPage', updateProgressBar);

            return () => {
                formioInstance.off('nextPage', updateProgressBar);
                formioInstance.off('prevPage', updateProgressBar);
            };
        }
    }, [formioInstance]);
    return (
        <div className="formio">
            <ProgressBar
                currentPage={currentPage}
                totalPages={
                    savedForm != undefined ? (savedForm.display === 'wizard' ? savedForm.components.length : 1) : 1
                }
            />
            <Form
                form={savedForm || { display: 'form' }}
                onFormioInstance={(instance) => setFormioInstance(instance)}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
                onSubmit={(form: unknown) => {
                    const formSubmissionData = form as FormSubmissionData;
                    handleFormSubmit(formSubmissionData.data);
                }}
            />
        </div>
    );
};

export default FormSubmit;

/* eslint-disable */
import React, { useState } from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';
import FormStepper from 'components/survey/submit/Stepper';
interface PageData {
    page: number;
    submission: unknown;
}

const FormSubmit = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const isMultiPage = savedForm && savedForm.display === 'wizard';
    console.log(savedForm);

    return (
        <div className="formio">
            {isMultiPage ? (
                <FormStepper
                    currentPage={currentPage}
                    totalPages={savedForm?.components.length - 1}
                    pages={savedForm?.components}
                />
            ) : (
                <></>
            )}
            <Form
                form={savedForm || { display: 'form' }}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
                onNextPage={(pageData: PageData) => setCurrentPage(pageData.page)}
                onPrevPage={(pageData: PageData) => setCurrentPage(pageData.page)}
                onSubmit={(form: unknown) => {
                    const formSubmissionData = form as FormSubmissionData;
                    handleFormSubmit(formSubmissionData.data);
                }}
            />
        </div>
    );
};

export default FormSubmit;

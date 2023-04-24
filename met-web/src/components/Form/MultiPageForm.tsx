import React, { useState } from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';
import FormStepper from 'components/survey/submit/Stepper';
interface PageData {
    page: number;
    submission: unknown;
}

const MultiPageForm = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalComponents = savedForm?.components?.length;
    return (
        <div className="formio">
            <FormStepper
                currentPage={currentPage}
                totalPages={totalComponents ? totalComponents - 1 : 0}
                pages={savedForm?.components || []}
            />
            <Form
                form={savedForm || { display: 'wizard' }}
                options={{ noAlerts: true }}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
                onNextPage={(pageData: PageData) => {
                    setCurrentPage(pageData.page);
                }}
                onPrevPage={(pageData: PageData) => setCurrentPage(pageData.page)}
                onSubmit={(form: unknown) => {
                    const formSubmissionData = form as FormSubmissionData;
                    handleFormSubmit(formSubmissionData.data);
                }}
            />
        </div>
    );
};

export default MultiPageForm;

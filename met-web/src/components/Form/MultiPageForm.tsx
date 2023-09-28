import React, { useState, useRef } from 'react';
import { Form } from '@formio/react';
import { FormSubmissionData, FormSubmitterProps } from './types';
import FormStepper from 'components/survey/submit/Stepper';
interface PageData {
    page: number;
    submission: unknown;
}

const MultiPageForm = ({ handleFormChange, savedForm, handleFormSubmit }: FormSubmitterProps) => {
    const [currentPage, setCurrentPage] = useState(0);

    const stepperRef = useRef<HTMLDivElement>(null);

    const handleScrollUp = () => {
        if (stepperRef.current) {
            stepperRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }
    };

    return (
        <div className="formio" ref={stepperRef}>
            <FormStepper currentPage={currentPage} pages={savedForm?.components ?? []} />
            <Form
                form={savedForm || { display: 'wizard' }}
                options={{ noAlerts: true }}
                onChange={(form: unknown) => handleFormChange(form as FormSubmissionData)}
                onNextPage={(pageData: PageData) => {
                    setCurrentPage(pageData.page);
                    handleScrollUp();
                }}
                onPrevPage={(pageData: PageData) => {
                    setCurrentPage(pageData.page);
                    handleScrollUp();
                }}
                onSubmit={(form: unknown) => {
                    const formSubmissionData = form as FormSubmissionData;
                    handleFormSubmit(formSubmissionData.data);
                }}
            />
        </div>
    );
};

export default MultiPageForm;

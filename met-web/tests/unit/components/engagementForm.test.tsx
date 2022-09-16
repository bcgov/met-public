import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import { createDefaultSurvey } from 'models/survey';

const surveys = [
    {
        ...createDefaultSurvey(),
        created_by: '2a160c34-a7bf-4d73-a980-b1e51d8a83dc',
        created_date: '2022-09-15 15:30:57.934554',
        engagement_id: '1',
        form_json: {
            components: [
                {
                    addons: [],
                    allowCalculateOverride: false,
                    allowMultipleMasks: false,
                    attributes: {},
                    autofocus: false,
                    calculateServer: false,
                    calculateValue: '',
                    clearOnHide: true,
                    conditional: {
                        eq: '',
                        show: null,
                        when: null,
                    },
                    customClass: '',
                    customDefaultValue: '',
                    dataGridLabel: false,
                    dbIndex: false,
                    defaultValue: null,
                    description: '',
                    disabled: false,
                    displayMask: '',
                    encrypted: false,
                    errorLabel: '',
                    hidden: false,
                    hideLabel: false,
                    id: 'e3h1rjf',
                    input: true,
                    inputFormat: 'plain',
                    inputMask: '',
                    inputMasks: [
                        {
                            label: '',
                            mask: '',
                        },
                    ],
                    inputType: 'text',
                    key: 'simpletextfield',
                    label: 'Single Line Answer',
                    labelPosition: 'top',
                    mask: false,
                    modalEdit: false,
                    multiple: false,
                    overlay: {
                        height: '',
                        left: '',
                        style: '',
                        top: '',
                        width: '',
                    },
                    persistent: true,
                    placeholder: '',
                    prefix: '',
                    properties: {},
                    protected: false,
                    redrawOn: '',
                    refreshOn: '',
                    showCharCount: false,
                    showWordCount: false,
                    spellcheck: true,
                    suffix: '',
                    tabindex: '',
                    tableView: false,
                    tooltip: '',
                    truncateMultipleSpaces: false,
                    type: 'simpletextfield',
                    unique: false,
                    validate: {
                        custom: '',
                        customMessage: '',
                        customPrivate: false,
                        maxLength: '',
                        minLength: '',
                        multiple: false,
                        pattern: '',
                        required: false,
                        strictDateValidation: false,
                        unique: false,
                    },
                    validateOn: 'change',
                    widget: {
                        type: 'input',
                    },
                },
            ],
            display: 'form',
        },
        id: 1,
        name: 'Survey 1',
        updated_by: '2a160c34-a7bf-4d73-a980-b1e51d8a83dc',
        updated_date: '2022-09-15 15:31:02.024991',
    },
];

const savedEngagement = {
    banner_filename: '',
    banner_url: '',
    content: 'Test content',
    created_by: '2a160c34-a7bf-4d73-a980-b1e51d8a83dc',
    created_date: '2022-09-14 20:16:29.846877',
    description: 'Test description',
    end_date: '2022-09-30',
    engagement_status: {
        created_date: '2022-09-14 15:37:22.754245',
        description: 'Not ready to the public',
        id: 1,
        status_name: 'Draft',
        updated_date: '2022-09-14 15:37:22.754247',
    },
    id: 1,
    name: 'Test Engagement',
    published_date: null,
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    start_date: '2022-09-01',
    status_id: 1,
    submission_status: 1,
    submissions_meta_data: {
        total: 1,
    },
    surveys: surveys,
    updated_by: '2a160c34-a7bf-4d73-a980-b1e51d8a83dc',
    updated_date: '2022-09-14 20:16:29.846881',
    user_id: '1',
};

describe('EngagementForm', () => {
    const useSelectorMock = jest.spyOn(reactRedux, 'useSelector').mockReturnValue({});
    const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const useNavigateMock = jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(savedEngagement));
    const putEngagementMock = jest
        .spyOn(engagementService, 'putEngagement')
        .mockReturnValue(Promise.resolve(savedEngagement));

    beforeEach(() => {
        setupEnv();
    });
    afterEach(() => {
        useSelectorMock.mockClear();
        useDispatchMock.mockClear();
        useNavigateMock.mockClear();
        useParamsMock.mockClear();
        getEngagementMock.mockClear();
        putEngagementMock.mockClear();
    });

    test('Test Engagement Form renders and has empty inputs by default', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { getByText } = render(<EngagementForm />);
        await waitFor(() => {
            expect(getByText('Engagement Name')).toBeInTheDocument();
        });
        expect(screen.getByText('Create Engagement Draft')).toBeInTheDocument();
    });

    test('Test cannot create engagement with empty fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);

        const createButton = getByText('Create Engagement Draft');
        fireEvent.click(createButton);

        expect(container.querySelectorAll('.Mui-error').length).toBeGreaterThan(0);
    });

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(screen.getByText('Update Engagement')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-30')).toBeInTheDocument();
        expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    test('Update engagement button should trigger Put call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });
        const updateButton = screen.getByText('Update Engagement');

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(putEngagementMock).toHaveBeenCalledOnce();
        });
    });

    test('Cannot add survey to unsaved engagement', async () => {
        const openNotificationMock = jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        render(<EngagementForm />);

        const addSurveyButton = screen.getByText('Add Survey');

        fireEvent.click(addSurveyButton);

        expect(openNotificationMock).toHaveBeenNthCalledWith(1, {
            severity: 'error',
            text: 'Please save the engagement before adding a survey',
        });
        openNotificationMock.mockClear();
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        const removeSurveyButton = screen.getByTestId('survey-widget/remove');

        fireEvent.click(removeSurveyButton);

        expect(screen.getByText('Do you want to remove this survey?')).toBeInTheDocument();
    });
});

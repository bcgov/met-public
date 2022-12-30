import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import { createDefaultSurvey, Survey } from 'models/survey';
import { WidgetType } from 'models/widget';
import { Box } from '@mui/material';
import { engagement } from '../factory';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

jest.mock('react-dnd', () => ({
    ...jest.requireActual('react-dnd'),
    useDrag: jest.fn(),
    useDrop: jest.fn(),
}));

jest.mock('components/common/Dragndrop', () => ({
    ...jest.requireActual('components/common/Dragndrop'),
    DragItem: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

const mockWidgetsRtkUnwrap = jest.fn(() => Promise.resolve([]));
const mockWidgetsRtkTrigger = () => {
    return {
        unwrap: mockWidgetsRtkUnwrap,
    };
};
export const mockWidgetsRtkQuery = () => [mockWidgetsRtkTrigger];

const mockLazyGetWidgetsQuery = jest.fn(mockWidgetsRtkQuery);
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useLazyGetWidgetsQuery: () => [...mockLazyGetWidgetsQuery()],
}));

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const openNotificationMock = jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());
    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const patchEngagementMock = jest
        .spyOn(engagementService, 'patchEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const postEngagementMock = jest
        .spyOn(engagementService, 'postEngagement')
        .mockReturnValue(Promise.resolve(engagement));

    beforeEach(() => {
        setupEnv();
    });

    test('Create engagement form is rendered with empty input fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);
        await waitFor(() => {
            expect(getByText('Engagement Name')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });
        expect(screen.getByText('Create Engagement Draft')).toBeInTheDocument();
        expect(getEngagementMock).not.toHaveBeenCalled();

        const nameInput = container.querySelector('input[name="name"]');
        expect(nameInput).not.toBeNull();
        expect(nameInput).toHaveAttribute('value', '');

        const fromDateInput = container.querySelector('input[name="start_date"]');
        expect(fromDateInput).not.toBeNull();
        expect(fromDateInput).toHaveAttribute('value', '');

        const toDateInput = container.querySelector('input[name="end_date"]');
        expect(toDateInput).not.toBeNull();
        expect(toDateInput).toHaveAttribute('value', '');

        expect(screen.getByText('Upcoming')).toBeInTheDocument();
        expect(screen.getByText('Open')).toBeInTheDocument();
        expect(screen.getByText('Closed')).toBeInTheDocument();

        expect(container.querySelector('input[type="file"][accept="image/*"]')).not.toBeNull();
    });

    test('Test cannot create engagement with empty fields', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        const { container, getByText } = render(<EngagementForm />);

        const createButton = getByText('Create Engagement Draft');
        fireEvent.click(createButton);

        expect(container.querySelectorAll('.Mui-error').length).toBeGreaterThan(0);
        expect(postEngagementMock).not.toHaveBeenCalled();
    });

    test('Engagement form with saved engagement should display saved info', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(getEngagementMock).toHaveBeenCalledOnce();
        expect(screen.getByText('Update Engagement')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2022-09-30')).toBeInTheDocument();
        expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    test('Update engagement button should trigger Put call', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });
        const updateButton = screen.getByText('Update Engagement');

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(patchEngagementMock).toHaveBeenCalledOnce();
        });
    });

    test('Cannot add survey to unsaved engagement', async () => {
        useParamsMock.mockReturnValue({ engagementId: 'create' });
        render(<EngagementForm />);

        const addSurveyButton = screen.getByText('Add Survey');

        fireEvent.click(addSurveyButton);

        expect(openNotificationMock).toHaveBeenNthCalledWith(1, {
            severity: 'error',
            text: 'Please save the engagement before adding a survey',
        });
    });

    test('Modal with warning appears when removing survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        expect(openNotificationModalMock).toHaveBeenCalledOnce();
    });

    test('Cannot add more than one survey', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Survey')).toBeDisabled();
    });

    test('Can move to settings tab', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const settingsTabButton = screen.getByText('Settings');

        fireEvent.click(settingsTabButton);

        expect(screen.getByText('Engagement Link')).toBeInTheDocument();
        expect(screen.getByDisplayValue('/engagements/1/view', { exact: false })).toBeInTheDocument();
    });

    test('Remove survey triggers notification modal', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );

        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: [],
            }),
        );

        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Survey 1')).toBeInTheDocument();

        const removeSurveyButton = screen.getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        await waitFor(() => {
            expect(openNotificationModalMock).toHaveBeenCalledOnce();
        });
    });

    test('Widget block appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        expect(screen.getByText('Add Widget')).toBeVisible();
        expect(mockWidgetsRtkUnwrap).toHaveBeenCalled();
    });

    test('Widget drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        mockWidgetsRtkUnwrap.mockReturnValueOnce(Promise.resolve([]));
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
            expect(screen.getByTestId(`widget-drawer-option/${WidgetType.WhoIsListening}`));
            expect(screen.getByTestId(`widget-drawer-option/${WidgetType.Phases}`));
        });
    });

    test('Day Calculator Modal appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            expect(getByTestId('daycalculator-title')).toBeVisible();
            expect(getByTestId('reset-button')).toBeVisible();
            expect(getByTestId('cancel-button')).toBeVisible();
            expect(getByTestId('calculator-button')).toBeVisible();
            expect(getByText('Start Date')).toBeInTheDocument();
            expect(getByText('End Date')).toBeInTheDocument();
            expect(getByText('Calculation Type')).toBeInTheDocument();
            expect(getByText('Number of Days')).toBeInTheDocument();
            const autocomplete = getByTestId('autocomplete');
            const input: HTMLInputElement = within(autocomplete).getByLabelText(
                "Day Zero"
            ) as HTMLInputElement;
            expect(input).not.toBeNull()
            const suspensiondate = screen.queryByText('Suspension Date')
            expect(suspensiondate).toBeNull()
            const ruspensiondate = screen.queryByText('Resumption Date')
            expect(ruspensiondate).toBeNull()
        });
    });

    test('Day Calculator Modal Day Zero Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const startDate = screen.getByPlaceholderText('startDate');
            const endDate = screen.getByPlaceholderText('endDate');
            fireEvent.change(startDate , {target: { value: '2022-12-19'}});
            fireEvent.change(endDate , {target: { value: '2022-12-25'}});
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const numberOfDays = screen.getByPlaceholderText('numberOfDays') as HTMLInputElement;
            expect(numberOfDays.value).toBe('6');
        });
    });

    test('Day Calculator Modal Start Date Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const numberOfDays = screen.getByPlaceholderText('numberOfDays');
            const endDate = screen.getByPlaceholderText('endDate');
            fireEvent.change(numberOfDays , {target: { value: '6'}});
            fireEvent.change(endDate , {target: { value: '2022-12-25'}});
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const startDate = screen.getByPlaceholderText('startDate') as HTMLInputElement;
            expect(startDate.value).toBe('2022-12-19');
        });
    });

    test('Day Calculator Modal End Date Calculation', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const dayCalculatorButton = screen.getByText('Day Calculator');

        fireEvent.click(dayCalculatorButton);

        await waitFor(() => {
            const startDate = screen.getByPlaceholderText('startDate');
            const numberOfDays = screen.getByPlaceholderText('numberOfDays');
            fireEvent.change(startDate , {target: { value: '2022-12-19'}});
            fireEvent.change(numberOfDays , {target: { value: '6'}});
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const endDate = screen.getByPlaceholderText('endDate') as HTMLInputElement;
            expect(endDate.value).toBe('2022-12-25');
        });
    });
});

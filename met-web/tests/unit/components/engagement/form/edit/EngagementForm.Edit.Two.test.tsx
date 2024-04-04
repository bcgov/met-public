import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../../../src/components/engagement/form';
import { setupEnv } from '../../../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as engagementContentService from 'services/engagementContentService';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import * as widgetService from 'services/widgetService';
import * as teamMemberService from 'services/membershipService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { WidgetType } from 'models/widget';
import { Box } from '@mui/material';
import { draftEngagement, engagementMetadata, engagementContentData } from '../../../factory';
import { USER_ROLES } from 'services/userService/constants';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

jest.mock('axios');

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));

jest.mock('components/common/Dragdrop', () => ({
    ...jest.requireActual('components/common/Dragdrop'),
    MetDroppable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
    MetDraggable: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@hello-pangea/dnd', () => ({
    ...jest.requireActual('@hello-pangea/dnd'),
    DragDropContext: ({ children }: { children: React.ReactNode }) => <Box>{children}</Box>,
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

jest.mock('components/map', () => () => {
    return <Box></Box>;
});

jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '' };
    }),
    useNavigate: () => jest.fn(),
}));

// Mocking window.location.pathname in Jest
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/engagements/1/form',
    },
});

describe('Engagement form page tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const openNotificationModalMock = jest
        .spyOn(notificationModalSlice, 'openNotificationModal')
        .mockImplementation(jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    jest.spyOn(engagementMetadataService, 'patchEngagementMetadata').mockReturnValue(
        Promise.resolve(engagementMetadata),
    );
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );
    jest.spyOn(engagementMetadataService, 'getMetadataTaxa').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementContentService, 'postEngagementContent').mockReturnValue(
        Promise.resolve(engagementContentData),
    );
    jest.spyOn(teamMemberService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([]));

    beforeEach(() => {
        setupEnv();
    });

    test('Remove survey triggers notification modal', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );

        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: [],
            }),
        );

        const { getByTestId, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getByText('Survey 1')).toBeInTheDocument();
        });

        const removeSurveyButton = getByTestId(`survey-widget/remove-${survey.id}`);

        fireEvent.click(removeSurveyButton);

        await waitFor(() => {
            expect(openNotificationModalMock).toHaveBeenCalledOnce();
        });
    });

    test('Widget block appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root'));
        });

        expect(screen.getByText('Add Widget')).toBeVisible();
        expect(getWidgetsMock).toHaveBeenCalled();
    });

    test('Widget drawer appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
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
            expect(getByText('Calculation Type')).toBeInTheDocument();
            expect(getByText('Number of Days')).toBeInTheDocument();
            const autocomplete = getByTestId('autocomplete');
            const input: HTMLInputElement = within(autocomplete).getByLabelText('Day Zero') as HTMLInputElement;
            expect(input).not.toBeNull();
            const suspensiondate = screen.queryByText('Suspension Date');
            expect(suspensiondate).toBeNull();
            const ruspensiondate = screen.queryByText('Resumption Date');
            expect(ruspensiondate).toBeNull();
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
            fireEvent.change(startDate, { target: { value: '2022-12-19' } });
            fireEvent.change(endDate, { target: { value: '2022-12-25' } });
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
            fireEvent.change(numberOfDays, { target: { value: '6' } });
            fireEvent.change(endDate, { target: { value: '2022-12-25' } });
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
            fireEvent.change(startDate, { target: { value: '2022-12-19' } });
            fireEvent.change(numberOfDays, { target: { value: '6' } });
            const calculatorButton = screen.getByText('Calculate');
            fireEvent.click(calculatorButton);
            const endDate = screen.getByPlaceholderText('endDate') as HTMLInputElement;
            expect(endDate.value).toBe('2022-12-25');
        });
    });

    test('Engagement summary tab appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        await waitFor(() => {
            expect(getByText('Summary')).toBeInTheDocument();
            expect(getByTestId('add-tab-menu')).toBeVisible();
            expect(getByText('Test content')).toBeInTheDocument();
        });
    });

    test('Add new custom tab Modal appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const addNewTabButton = getByTestId('add-tab-menu');
        fireEvent.click(addNewTabButton);

        await waitFor(() => {
            expect(getByTestId('add-new-custom-tab')).toBeVisible();
        });

        const addNewCustomTab = getByTestId('add-new-custom-tab');
        fireEvent.click(addNewCustomTab);

        await waitFor(() => {
            expect(getByTestId('add-tab-button')).toBeVisible();
            expect(getByText('Tab Title:')).toBeInTheDocument();
            expect(getByText('Tab Icon:')).toBeInTheDocument();
        });
    });

    test('Edit tab Modal appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container, getByText } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const addNewTabButton = getByTestId('edit-tab-details');
        fireEvent.click(addNewTabButton);

        await waitFor(() => {
            expect(getByTestId('update-tab-button')).toBeVisible();
            expect(getByText('Edit the engagement content tab')).toBeInTheDocument();
        });
    });

    test('Test cannot create tab with empty fields', async () => {
        const handleCreateTab = jest.fn();
        useParamsMock.mockReturnValue({ engagementId: '1' });
        const { getByTestId, container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
        });

        const addNewTabButton = getByTestId('add-tab-menu');
        fireEvent.click(addNewTabButton);

        await waitFor(() => {
            expect(getByTestId('add-new-custom-tab')).toBeVisible();
        });

        const addNewCustomTab = getByTestId('add-new-custom-tab');
        fireEvent.click(addNewCustomTab);

        await waitFor(() => {
            expect(getByTestId('add-tab-button')).toBeVisible();
        });

        const addButton = getByTestId('add-tab-button');
        fireEvent.click(addButton);
        expect(handleCreateTab).not.toHaveBeenCalled();
    });
});

import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as engagementMetadataService from 'services/engagementMetadataService';
import * as membershipService from 'services/membershipService';
import * as engagementSettingService from 'services/engagementSettingService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { draftEngagement, engagementMetadata } from '../factory';
import { USER_ROLES } from 'services/userService/constants';
import { EngagementSettings, createDefaultEngagementSettings } from 'models/engagement';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

jest.mock('axios');

const surveys = [survey];

const phaseWidgetItem: WidgetItem = {
    id: 2,
    widget_id: 2,
    widget_data_id: 0,
    sort_index: 1,
};

const phasesWidget: Widget = {
    id: 2,
    title: 'Environmental Assessment Process',
    widget_type_id: WidgetType.Phases,
    engagement_id: 1,
    items: [],
};

const mockEngagementSettings: EngagementSettings = {
    ...createDefaultEngagementSettings(),
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({ search: '' })),
    useParams: jest.fn(() => {
        return { projectId: '' };
    }),
    useNavigate: () => jest.fn(),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [USER_ROLES.VIEW_PRIVATE_ENGAGEMENTS, USER_ROLES.EDIT_ENGAGEMENT, USER_ROLES.CREATE_ENGAGEMENT],
            assignedEngagements: [draftEngagement.id],
        };
    }),
}));

jest.mock('@reduxjs/toolkit/query/react', () => ({
    ...jest.requireActual('@reduxjs/toolkit/query/react'),
    fetchBaseQuery: jest.fn(),
}));

jest.mock('components/map', () => () => {
    return <div></div>;
});

const mockCreateWidget = jest.fn(() => Promise.resolve(phasesWidget));
const mockCreateWidgetItems = jest.fn(() => Promise.resolve([phaseWidgetItem]));
const mockCreateWidgetItemsTrigger = jest.fn(() => {
    return {
        unwrap: mockCreateWidgetItems,
    };
});
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useCreateWidgetItemsMutation: () => [mockCreateWidgetItemsTrigger],
    useUpdateWidgetMutation: () => [jest.fn(() => Promise.resolve(phasesWidget))],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

describe('Phases widget tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([phasesWidget]));
    jest.spyOn(engagementMetadataService, 'getEngagementMetadata').mockReturnValue(
        Promise.resolve([engagementMetadata]),
    );
    jest.spyOn(membershipService, 'getTeamMembers').mockReturnValue(Promise.resolve([]));
    jest.spyOn(engagementSettingService, 'getEngagementSettings').mockReturnValue(
        Promise.resolve(mockEngagementSettings),
    );

    beforeEach(() => {
        setupEnv();
    });

    test.only('Phases widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        mockCreateWidget.mockReturnValue(Promise.resolve(phasesWidget));
        mockCreateWidgetItems.mockReturnValue(Promise.resolve([phaseWidgetItem]));
        render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByText('Add Widget')).toBeInTheDocument();
        });

        const addWidgetButton = screen.getByText('Add Widget');
        fireEvent.click(addWidgetButton);

        await waitFor(() => {
            expect(screen.getByText('Select Widget')).toBeVisible();
        });

        getWidgetsMock.mockReturnValueOnce(Promise.resolve([phasesWidget]));

        const phasesOption = screen.getByTestId(`widget-drawer-option/${WidgetType.Phases}`);
        fireEvent.click(phasesOption);

        await waitFor(() => {
            expect(screen.getByTestId('engagementPhaseSelect')).toBeVisible();
        });

        expect(mockCreateWidget).toHaveBeenNthCalledWith(1, {
            widget_type_id: WidgetType.Phases,
            engagement_id: draftEngagement.id,
            title: phasesWidget.title,
        });
        expect(getWidgetsMock).toHaveBeenCalledTimes(2);

        const saveWidgetButton = screen.getByTestId('savePhasesWidgetButton');
        expect(saveWidgetButton).toBeDisabled();

        const standalonePhaseCheckbox = screen.getByTestId('standalonePhaseCheckbox');
        fireEvent.click(standalonePhaseCheckbox);

        expect(saveWidgetButton).toBeEnabled();

        fireEvent.click(saveWidgetButton);

        await waitFor(() => {
            expect(saveWidgetButton).not.toBeVisible();
        });

        expect(mockCreateWidgetItemsTrigger).toHaveBeenNthCalledWith(1, {
            widget_id: phasesWidget.id,
            widget_items_data: [
                {
                    widget_id: phasesWidget.id,
                    widget_data_id: 0,
                },
            ],
        });
    });
});

import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { draftEngagement } from '../factory';
import { SCOPES } from 'components/permissionsGate/PermissionMaps';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const phaseWidgetItem: WidgetItem = {
    id: 2,
    widget_id: 2,
    widget_data_id: 0,
    sort_index: 1,
};

const phasesWidget: Widget = {
    id: 2,
    widget_type_id: WidgetType.Phases,
    engagement_id: 1,
    items: [],
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(() => {
        return {
            roles: [SCOPES.viewPrivateEngagement, SCOPES.editEngagement, SCOPES.createEngagement],
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
jest.mock('apiManager/apiSlices/widgets', () => ({
    ...jest.requireActual('apiManager/apiSlices/widgets'),
    useCreateWidgetMutation: () => [mockCreateWidget],
    useDeleteWidgetMutation: () => [jest.fn(() => Promise.resolve())],
    useSortWidgetsMutation: () => [jest.fn(() => Promise.resolve())],
}));

describe('Phases widget tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(draftEngagement));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([phasesWidget]));

    beforeEach(() => {
        setupEnv();
    });

    test('Phases widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...draftEngagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([]));
        const postWidgetItemMock = jest.spyOn(widgetService, 'postWidgetItem');
        mockCreateWidget.mockReturnValue(Promise.resolve(phasesWidget));
        postWidgetItemMock.mockReturnValue(Promise.resolve(phaseWidgetItem));
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

        expect(postWidgetItemMock).toHaveBeenNthCalledWith(1, phasesWidget.id, {
            widget_id: phasesWidget.id,
            widget_data_id: 0,
        });
    });
});

import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../../src/components/engagement/form';
import { setupEnv } from '../setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import { createDefaultSurvey, Survey } from 'models/survey';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { engagement } from '../factory';

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

describe('Phases widget tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(engagement));

    beforeEach(() => {
        setupEnv();
    });

    test('Phases widget is created when option is clicked', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets');
        const postWidgetMock = jest.spyOn(widgetService, 'postWidget');
        const postWidgetItemMock = jest.spyOn(widgetService, 'postWidgetItem');
        getWidgetsMock.mockReturnValue(Promise.resolve([]));
        postWidgetMock.mockReturnValue(Promise.resolve(phasesWidget));
        postWidgetItemMock.mockReturnValue(Promise.resolve(phaseWidgetItem));
        const { container } = render(<EngagementForm />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Engagement')).toBeInTheDocument();
            expect(container.querySelector('span.MuiSkeleton-root')).toBeNull();
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

        expect(postWidgetMock).toHaveBeenNthCalledWith(1, engagement.id, {
            widget_type_id: WidgetType.Phases,
            engagement_id: engagement.id,
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

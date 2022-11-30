import { render, waitFor, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import * as EngagementView from '../../../src/components/engagement/view';
import ProviderShell from './ProviderShell';
import { Contact } from 'models/contact';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as contactService from 'services/contactService';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { createDefaultSurvey, Survey } from 'models/survey';
import { engagement } from '../components/factory';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const mockContact: Contact = {
    id: 1,
    name: 'Jace',
    title: 'prince',
    phone_number: '123-123-1234',
    email: 'jace@gmail.com',
    address: 'Dragonstone, Westeros',
    bio: 'Jacaerys Targaryen is the son and heir of Rhaenyra Targaryen',
    avatar_filename: '',
    avatar_url: '',
};

const widgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const widget: Widget = {
    id: 1,
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [widgetItem],
};

describe('Engagement View page tests', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => jest.fn());
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(reactRouter, 'useNavigate').mockImplementation(() => jest.fn());
    const useParamsMock = jest.spyOn(reactRouter, 'useParams');
    const getEngagementMock = jest
        .spyOn(engagementService, 'getEngagement')
        .mockReturnValue(Promise.resolve(engagement));
    const getContactsMock = jest.spyOn(contactService, 'getContacts').mockReturnValue(Promise.resolve([mockContact]));
    const getWidgetsMock = jest.spyOn(widgetService, 'getWidgets').mockReturnValue(Promise.resolve([widget]));

    beforeEach(() => {
        setupEnv();
    });

    test('Look at Engagement view', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([widget]));
        getContactsMock.mockReturnValueOnce(Promise.resolve([mockContact]));
        render(
            <ProviderShell>
                <EngagementView.Engagement />
            </ProviderShell>,
        );
        await waitFor(() => {
            expect(screen.getByTestId(`engagement-content`)).toBeVisible();
        });
    });

    test('Who is listening widget block appears', async () => {
        useParamsMock.mockReturnValue({ engagementId: '1' });
        getEngagementMock.mockReturnValueOnce(
            Promise.resolve({
                ...engagement,
                surveys: surveys,
            }),
        );
        getWidgetsMock.mockReturnValueOnce(Promise.resolve([widget]));
        getContactsMock.mockReturnValueOnce(Promise.resolve([mockContact]));
        render(
            <ProviderShell>
                <EngagementView.Engagement />
            </ProviderShell>,
        );

        await waitFor(() => {
            expect(screen.getByTestId(`widget-block`)).toBeVisible();
        });
    });
});

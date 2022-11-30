import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import EngagementForm from '../../../src/components/engagement/form';
import { setupEnv } from './setEnvVars';
import * as reactRedux from 'react-redux';
import * as reactRouter from 'react-router';
import * as engagementService from 'services/engagementService';
import * as widgetService from 'services/widgetService';
import * as contactService from 'services/contactService';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import * as notificationModalSlice from 'services/notificationModalService/notificationModalSlice';
import { createDefaultSurvey, Survey } from 'models/survey';
import { createDefaultEngagement, Engagement } from 'models/engagement';
import { EngagementStatus } from 'constants/engagementStatus';
import { Widget, WidgetItem, WidgetType } from 'models/widget';
import { Contact } from 'models/contact';
import { Box } from '@mui/material';

const survey: Survey = {
    ...createDefaultSurvey(),
    id: 1,
    name: 'Survey 1',
    engagement_id: 1,
};

const surveys = [survey];

const engagement: Engagement = {
    ...createDefaultEngagement(),
    id: 1,
    name: 'Test Engagement',
    created_date: '2022-09-14 20:16:29.846877',
    rich_content:
        '{"blocks":[{"key":"29p4m","text":"Test content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    content: 'Test content',
    rich_description:
        '{"blocks":[{"key":"bqupg","text":"Test description","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    description: 'Test description',
    start_date: '2022-09-01',
    end_date: '2022-09-30',
    surveys: surveys,
    engagement_status: {
        id: EngagementStatus.Draft,
        status_name: 'Draft',
    },
};

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

const contactWidgetItem: WidgetItem = {
    id: 1,
    widget_id: 1,
    widget_data_id: 1,
    sort_index: 1,
};

const whoIsListeningWidget: Widget = {
    id: 1,
    widget_type_id: WidgetType.WhoIsListening,
    engagement_id: 1,
    items: [contactWidgetItem],
};

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
    items: [phaseWidgetItem],
};


export {engagement};
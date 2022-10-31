import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import * as reactRedux from 'react-redux';
import * as notificationSlice from 'services/notificationService/notificationSlice';
import '@testing-library/jest-dom';
import { setupEnv } from './setEnvVars';
import ScheduleModal from 'components/common/Modals/Schedule';
import ProviderShell from './ProviderShell';

describe('Schedule modal tests', () => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn());
    jest.spyOn(notificationSlice, 'openNotification').mockImplementation(jest.fn());

    beforeEach(() => {
        setupEnv();
    });

    test('Reschedule shows ', async () => {
        const { getByTestId } = render(
            <ProviderShell>
                <ScheduleModal
                    updateModal={() => {
                        console.log('schedule modal');
                    }}
                    open={true}
                    reschedule={false}
                />
            </ProviderShell>,
        );
        const scheduleButton = getByTestId('schedule-button');
        const timePicker = getByTestId('time-picker');
        const datePicker = getByTestId('desktop-datepicker');

        //set up date
        await waitFor(() => {
            expect(datePicker).toBeVisible();
        });
        fireEvent.click(datePicker);

        //set up time
        await waitFor(() => {
            expect(timePicker).toBeVisible();
        });
        fireEvent.click(timePicker);

        //schedule
        await waitFor(() => {
            expect(scheduleButton).toBeVisible();
        });
        fireEvent.click(scheduleButton);
    });
});

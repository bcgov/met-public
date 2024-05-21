import React from 'react';
// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom';
// the component to test
import { PrimaryButtonOld } from 'components/common';

test('loads and displays greeting', async () => {
    render(
        <PrimaryButtonOld data-testid="test-button" onClick={() => console.log('Hello')}>
            Hello
        </PrimaryButtonOld>,
    );
    fireEvent.click(screen.getByTestId('test-button'));

    await waitFor(() => screen.getByTestId('test-button'));

    expect(screen.getByTestId('test-button')).toHaveTextContent('Hello');

    expect(screen.getByTestId('test-button')).not.toBeDisabled();
});

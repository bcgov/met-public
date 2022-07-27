import React from 'react';
// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom';
// the component to test
import Button from '@mui/material/Button';

test('loads and displays greeting', async () => {
    render(
        <Button data-testid="test-button" onClick={() => console.log('Hello')} variant="contained">
            Hello
        </Button>,
    );
    fireEvent.click(screen.getByTestId('test-button'));

    await waitFor(() => screen.getByTestId('test-button'));

    expect(screen.getByTestId('test-button')).toHaveTextContent('Hello');

    expect(screen.getByTestId('test-button')).not.toBeDisabled();
});

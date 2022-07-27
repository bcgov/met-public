import React from 'react';
// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom';
// the component to test
import Button from '@mui/material/Button';

test('loads and displays greeting', async () => {
    // Arrange
    // Act
    // Assert
    render(
        <Button data-testid="test-button" onClick={() => console.log('Hello')} variant="contained">
            Hello
        </Button>,
    );
    fireEvent.click(screen.getByTestId('test-button'));

    // wait until the `get` request promise resolves and
    // the component calls setState and re-renders.
    // `waitFor` waits until the callback doesn't throw an error

    await waitFor(() =>
        // getByRole throws an error if it cannot find an element
        screen.getByTestId('test-button'),
    );
    // assert that the alert message is correct using
    // toHaveTextContent, a custom matcher from jest-dom.
    expect(screen.getByTestId('test-button')).toHaveTextContent('Hello');

    // assert that the button is not disabled using
    // toBeDisabled, a custom matcher from jest-dom.
    expect(screen.getByTestId('test-button')).not.toBeDisabled();
});

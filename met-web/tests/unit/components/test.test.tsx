import React from 'react';
// import react-testing methods
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom';
// the component to test

import { Button } from 'components/common/Input/Button';

test('loads and displays greeting', async () => {
    const handleClick = jest.fn();
    render(
        <Button variant="primary" data-testid="test-button" onClick={handleClick}>
            Hello
        </Button>,
    );
    fireEvent.click(screen.getByTestId('test-button'));

    await waitFor(() => screen.getByTestId('test-button'));

    expect(screen.getByTestId('test-button')).toHaveTextContent('Hello');

    expect(handleClick).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('test-button')).not.toBeDisabled();
});

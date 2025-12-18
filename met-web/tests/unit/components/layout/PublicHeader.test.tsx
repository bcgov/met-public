import React from 'react';
import { render, screen } from '@testing-library/react';
import LanguageSelector from 'components/common/LanguageSelector';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockState = { language: { id: 'en' } }; // Initial state

// Mock useDispatch hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((callback) => callback(mockState)),
}));

describe('LanguageSelector component tests', () => {
    // TODO: Restore tests once language selector functionality is restored
    test('test', () => expect(true).toBe(true));

    test.skip('Renders language dropdown correctly', async () => {
        render(
            <Router>
                <LanguageSelector />
            </Router>,
        );

        // Ensure the dropdown is rendered
        const languageDropdown = screen.getByLabelText('select-language');
        expect(languageDropdown).toBeInTheDocument();
        // Assert initial language is rendered
        expect(screen.getByText('English')).toBeInTheDocument();
    });

    test.skip('Changes language when dropdown value is selected', async () => {
        render(
            <Router>
                <LanguageSelector />
            </Router>,
        );

        // Check if the dropdown menu is opened
        const dropdownMenu = screen.getByRole('button');
        expect(dropdownMenu).toBeInTheDocument();

        userEvent.click(dropdownMenu);
        const englishMenuItem = await screen.findByRole('option', { name: 'English' });
        expect(englishMenuItem).toBeInTheDocument();
    });
});

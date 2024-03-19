import React from 'react';
import { render, screen } from '@testing-library/react';
import LanguageSelector from 'components/common/LanguageSelector';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock useDispatch hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

// Mock useSelector hook
const mockState = { language: { id: 'en' } }; // Initial state
(useSelector as jest.Mock).mockImplementation((selectorFn) => selectorFn(mockState));

// Mock useDispatch hook function
const mockDispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(mockDispatch);

describe('LanguageSelector component tests', () => {
    test('Renders language dropdown correctly', async () => {
        render(
            <Router>
                <LanguageSelector />
            </Router>
        );

        // Ensure the dropdown is rendered
        const languageDropdown = screen.getByLabelText('select-language');
        expect(languageDropdown).toBeInTheDocument();
        // Assert initial language is rendered
        expect(screen.getByText('English')).toBeInTheDocument();
    });

    test('Changes language when dropdown value is selected', async () => {
        render(
            <Router>
                <LanguageSelector />
            </Router>
        );

        // Check if the dropdown menu is opened
        const dropdownMenu = screen.getByRole('button');
        expect(dropdownMenu).toBeInTheDocument();

        userEvent.click(dropdownMenu);
        const englishMenuItem = await screen.findByRole('option', { name: 'English' });
        expect(englishMenuItem).toBeInTheDocument();
    });
});

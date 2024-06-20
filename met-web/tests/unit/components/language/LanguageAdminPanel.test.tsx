import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import LanguageAdminPanel, { addOrRemoveLanguage } from 'components/language';
import * as languageService from 'services/languageService';

const mockLanguage = {
    id: 89,
    code: 'el',
    name: 'Elvish',
    right_to_left: null,
};

const mockSecondLanguage = {
    id: 90,
    code: 'tlh',
    name: 'Klingon',
    right_to_left: null,
}

const mockLanguageTenantMapping = {
    id: 14,
    language_id: 89,
    tenant_id: 3,
}

// Mock useDispatch hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

// Mock useDispatch hook function
const mockDispatch = jest.fn();
(useDispatch as jest.Mock).mockReturnValue(mockDispatch);

jest.mock('services/languageService', () => ({
    getLanguages: jest.fn(),
    getTenantLanguages: jest.fn(),
    postTenantLanguage: jest.fn(),
    deleteTenantLanguage: jest.fn(),
}));

describe('LanguageAdminPanel component tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(languageService, 'getLanguages').mockResolvedValue([]);
        jest.spyOn(languageService, 'getTenantLanguages').mockResolvedValue([]);
        jest.spyOn(languageService, 'postTenantLanguage').mockResolvedValue([mockLanguageTenantMapping]);
        jest.spyOn(languageService, 'deleteTenantLanguage').mockResolvedValue({ message: '', status: 'success' });
    });


    test('Language view renders', async () => {
        await act(async () => {
            render(<LanguageAdminPanel />);
        });
        await waitFor(() => {
            expect(screen.getByTestId(`language-admin-panel`)).toBeVisible();
        });
    });

    test('Language selection updates', async () => {
        await addOrRemoveLanguage('gdx', [mockLanguage, mockSecondLanguage], [mockLanguage]);
        expect(languageService.postTenantLanguage).toHaveBeenCalledWith('gdx', mockSecondLanguage.id);
        await addOrRemoveLanguage('gdx', [mockLanguage], [mockLanguage, mockSecondLanguage]);
        expect(languageService.deleteTenantLanguage).toHaveBeenCalledWith('gdx', mockSecondLanguage.id);
    });
});
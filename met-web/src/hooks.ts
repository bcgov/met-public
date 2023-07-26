import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useTranslation } from 'react-i18next';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppTranslation = () => {
    const translate = useTranslation();
    const basename = localStorage.getItem('tenantId');

    const { t } = translate;

    const tDynamic = (key: string) => {
        // Create a dynamic translation key using the basename
        const dynamicKey = `${basename}:${key}`;
        return t(dynamicKey);
    };

    return { ...translate, t: tDynamic };
};

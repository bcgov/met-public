import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppTranslation = () => {
    const translate = useTranslation();
    const tenantId = sessionStorage.getItem('tenantId');

    const { t } = translate;

    const tDynamic = (key: string) => {
        // Create a dynamic translation key using the tenantId
        const dynamicKey = `${tenantId}:${key}`;
        return t(dynamicKey);
    };

    return { ...translate, t: tDynamic };
};

export const useSubmittedPolls = () => {
    const cookie_name = '_su_p_';
    const cookies = new Cookies();
    const getSubmittedPolls = () => cookies.get(cookie_name) || [];
    const addSubmittedPoll = (widget_id: number) => {
        const submittedPolls = getSubmittedPolls();
        if (!submittedPolls.includes(widget_id)) {
            submittedPolls.push(widget_id);
            // Calculate the expiry date one year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            cookies.set(cookie_name, submittedPolls, { path: '/', expires: oneYearFromNow });
        }
    };
    return { getSubmittedPolls, addSubmittedPoll };
};

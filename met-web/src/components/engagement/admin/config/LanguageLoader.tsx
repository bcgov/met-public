import { getTenantLanguages } from 'services/languageService';

export const languageLoader = async () => {
    const tenantId = sessionStorage.getItem('tenantId');
    const languages = getTenantLanguages(tenantId ?? '').then((response) => response);
    return { languages };
};

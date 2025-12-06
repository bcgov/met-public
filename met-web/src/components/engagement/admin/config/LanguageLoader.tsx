import { Language } from 'models/language';
import { getTenantLanguages } from 'services/languageService';

export type LanguageLoaderData = {
    languages: Promise<Language[]>;
};

export const languageLoader = async () => {
    const tenantId = sessionStorage.getItem('tenantId');
    const languages = getTenantLanguages(tenantId ?? '').then((response) => response);
    return { languages };
};

export default languageLoader;

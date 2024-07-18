import { getTenantLanguages } from 'services/languageService';
import { defer } from 'react-router-dom';

export const WizardLoader = async () => {
    const tenantId = sessionStorage.getItem('tenantId');
    const languages = getTenantLanguages(tenantId ?? '').then((response) => response);
    return defer({ languages });
};

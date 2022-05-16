let PROJECT_URL =
  process.env.REACT_APP_API_PROJECT_URL ||
  'https://formio-e903c2-dev.apps.gold.devops.gov.bc.ca';
let API_URL =
  process.env.REACT_APP_API_SERVER_URL ||
  'https://formio-e903c2-dev.apps.gold.devops.gov.bc.ca';

PROJECT_URL = PROJECT_URL;
API_URL = API_URL;

export const AppConfig = {
  projectUrl: PROJECT_URL,
  apiUrl: API_URL,
};

declare global {
    interface Window {
        _env_: {
            REACT_APP_API_PROJECT_URL: string;
        };
    }
}

const PROJECT_URL = window._env_.REACT_APP_API_PROJECT_URL || process.env.REACT_APP_API_PROJECT_URL;

const API_URL = window._env_.REACT_APP_API_PROJECT_URL || process.env.REACT_APP_API_SERVER_URL;

export const AppConfig = {
    projectUrl: PROJECT_URL,
    apiUrl: API_URL,
};

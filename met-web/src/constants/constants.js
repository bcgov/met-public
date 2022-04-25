const getFromEnv = (key, defaultValue = "") => {
  if (!key) return "";

  return window._env_?.[key] || process.env[key] || defaultValue;
};

//keycloak
export const Keycloak_Client = getFromEnv("REACT_APP_KEYCLOAK_CLIENT");

export const KEYCLOAK_URL = getFromEnv("REACT_APP_KEYCLOAK_URL");

export const KEYCLOAK_REALM = getFromEnv("REACT_APP_KEYCLOAK_REALM");

export const KEYCLOAK_AUTH_URL = `${KEYCLOAK_URL}`;

const getFromEnv = (key: string, defaultValue: string = "") => {
  if (!key) return "";

  return process.env[key] || defaultValue;
};

//keycloak
export const Keycloak_Client = getFromEnv("REACT_APP_KEYCLOAK_CLIENT");

export const KEYCLOAK_URL = getFromEnv("REACT_APP_KEYCLOAK_URL");

export const KEYCLOAK_REALM = getFromEnv("REACT_APP_KEYCLOAK_REALM");

export const ADMIN_ROLE = "admin";

export const KEYCLOAK_AUTH_URL = `${KEYCLOAK_URL}`;

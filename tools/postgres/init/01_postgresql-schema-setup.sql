CREATE SCHEMA met AUTHORIZATION met;
ALTER ROLE met SET search_path TO met;

CREATE SCHEMA analytics AUTHORIZATION analytics;
ALTER ROLE analytics SET search_path TO analytics;

CREATE SCHEMA keycloak AUTHORIZATION keycloak;
ALTER ROLE keycloak SET search_path TO keycloak;

CREATE SCHEMA redash AUTHORIZATION redash;
ALTER ROLE redash SET search_path TO redash;

CREATE SCHEMA dagster AUTHORIZATION dagster;
ALTER ROLE dagster SET search_path TO dagster;

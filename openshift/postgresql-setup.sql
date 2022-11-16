CREATE ROLE met WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
	PASSWORD <PWD>;
CREATE SCHEMA met AUTHORIZATION met;
ALTER ROLE met SET search_path TO met;

CREATE ROLE analytics WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
	PASSWORD <PWD>;
CREATE SCHEMA analytics AUTHORIZATION analytics;
ALTER ROLE analytics SET search_path TO analytics;

CREATE ROLE keycloak WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
	PASSWORD <PWD>;
CREATE SCHEMA keycloak AUTHORIZATION keycloak;
ALTER ROLE keycloak SET search_path TO keycloak;

CREATE ROLE redash WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
	PASSWORD <PWD>;
CREATE SCHEMA redash AUTHORIZATION redash;
ALTER ROLE redash SET search_path TO redash;

CREATE ROLE dagster WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
	PASSWORD <PWD>;
CREATE SCHEMA dagster AUTHORIZATION dagster;
ALTER ROLE dagster SET search_path TO dagster;

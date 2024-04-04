# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""
All the configuration for MET's Analytics API.

Wherever possible, the configuration is loaded from the environment. The aim is
to have this be the "single source of truth" for configuration in the API,
wherever feasible. If you are adding a setting or config option that cannot be
configured in a user-facing GUI, please make sure it loads its value from here,
and create an entry for it in the sample .env file.
"""

import os

from typing import Union
from dotenv import find_dotenv, load_dotenv

from analytics_api.utils.util import is_truthy

# Search in increasingly higher folders for a .env file, then load it,
# appending any variables we find to the current environment.
load_dotenv(find_dotenv())
# remove all env variables with no text (allows for entries to be unset easily)
os.environ = {k: v for k, v in os.environ.items() if v}


def get_named_config(environment: Union[str, None]) -> 'Config':
    """
    Retrieve a configuration object by name. Used by the Flask app factory.

    :param config_name: The name of the configuration.
    :return: The requested configuration object.
    :raises: KeyError if the requested configuration is not found.
    """
    config_mapping = {
        'development': DevConfig,
        'default': ProdConfig,
        'staging': ProdConfig,
        'production': ProdConfig,
        'testing': TestConfig,
    }
    try:
        print(f'Loading configuration: {environment}...')
        return config_mapping.get(environment or 'production', ProdConfig)()
    except KeyError as e:
        raise KeyError(f'Configuration "{environment}" not found.') from e


def env_truthy(env_var, default: Union[bool, str] = False):
    """
    Return True if the environment variable is set to a truthy value.

    Accepts a default value, which is returned if the environment variable is
    not set.
    """
    return is_truthy(os.getenv(env_var, str(default)))


class Config():  # pylint: disable=too-few-public-methods
    """Base class configuration that should set reasonable defaults for all the other configurations."""

    def __init__(self) -> None:
        """
        Initialize the configuration object.

        Performs more advanced configuration logic that is not possible
        in the normal class definition.
        """
        # If extending this class, call super().__init__() in your constructor.
        print(f'SQLAlchemy URL: {self.SQLALCHEMY_DATABASE_URI}')

        # apply configs to _Config in the format that flask_jwt_oidc expects
        # this flattens the JWT_CONFIG dict into individual attributes
        for key, value in self.JWT_CONFIG.items():
            setattr(self, f'JWT_OIDC_{key}', value)

        # Enable live reload and interactive API debugger for developers
        os.environ['FLASK_DEBUG'] = str(self.USE_DEBUG)

    @property
    # pylint: disable=invalid-name
    def SQLALCHEMY_DATABASE_URI(self) -> str:  # noqa
        """
        Dynamically fetch the SQLAlchemy Database URI based on the DB config.

        This avoids having to redefine the URI after setting the DB access
        credentials in subclasses. Can be overridden by env variables.
        """
        return os.environ.get(
            'SQLALCHEMY_DATABASE_URI',
            f'postgresql://'
            f'{self.DB_CONFIG.get("USER")}:{self.DB_CONFIG.get("PASSWORD")}@'
            f'{self.DB_CONFIG.get("HOST")}:{self.DB_CONFIG.get("PORT")}/'
            f'{self.DB_CONFIG.get("NAME")}'
        )

    # If enabled, Exceptions are propagated up, instead of being handled
    # by the the app’s error handlers. Enable this for tests.
    TESTING = env_truthy('FLASK_TESTING', default=False)

    # If enabled, the interactive debugger will be shown for any
    # unhandled Exceptions, and the server will be reloaded when code changes.
    USE_DEBUG = env_truthy('FLASK_DEBUG', default=False)

    # SQLAlchemy settings
    # Echoes the SQL queries generated - useful for debugging
    SQLALCHEMY_ECHO = env_truthy('SQLALCHEMY_ECHO')
    # Disable modification tracking for performance
    SQLALCHEMY_TRACK_MODIFICATIONS = env_truthy('SQLALCHEMY_TRACK_MODIFICATIONS')

    # Used for session management. Randomized by default for security, but
    # should be set to a fixed value in production to avoid invalidating sessions.
    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))

    # PostgreSQL configuration
    DB_CONFIG = DB = {
        'USER': os.getenv('DATABASE_USERNAME', ''),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
        'NAME': os.getenv('DATABASE_NAME', ''),
        'HOST': os.getenv('DATABASE_HOST', ''),
        'PORT': os.getenv('DATABASE_PORT', '5432'),
    }

    # Keycloak configuration
    KEYCLOAK_CONFIG = KC = {
        'BASE_URL': os.getenv('KEYCLOAK_BASE_URL', ''),
        'REALMNAME': os.getenv('KEYCLOAK_REALMNAME', 'standard'),
    }

    # JWT OIDC Settings (for Keycloak)
    JWT_CONFIG = JWT = {
        'ISSUER': (
            _issuer := os.getenv(
                'JWT_OIDC_ISSUER',
                f'{KC["BASE_URL"]}/realms/{KC["REALMNAME"]}'
            )),
        'WELL_KNOWN_CONFIG': os.getenv(
            'JWT_OIDC_WELL_KNOWN_CONFIG',
            f'{_issuer}/.well-known/openid-configuration',
        ),
        'JWKS_URI': os.getenv('JWT_OIDC_JWKS_URI', f'{_issuer}/protocol/openid-connect/certs'),
        'ALGORITHMS': os.getenv('JWT_OIDC_ALGORITHMS', 'RS256'),
        'AUDIENCE': os.getenv('JWT_OIDC_AUDIENCE', 'account'),
        'CACHING_ENABLED': str(env_truthy('JWT_OIDC_CACHING_ENABLED', True)),
        'JWKS_CACHE_TIMEOUT': int(os.getenv('JWT_OIDC_JWKS_CACHE_TIMEOUT', '300')),
        'ROLE_CLAIM': os.getenv('JWT_OIDC_ROLE_CLAIM', 'client_roles'),
    }

    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')


class DevConfig(Config):  # pylint: disable=too-few-public-methods
    """Dev Config."""

    # Default to using the debugger for development
    USE_DEBUG = env_truthy('USE_DEBUG', True)


class TestConfig(Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""

    # Propagate exceptions up to the test runner
    TESTING = env_truthy('TESTING', default=True)

    # explicitly disable the debugger; we want the tests to fail if an
    # unhandled exception occurs
    USE_DEBUG = False

    # Override the DB config to use the test database, if one is configured
    DB_CONFIG = {
        'USER': os.getenv('DATABASE_TEST_USERNAME', Config.DB.get('USER')),
        'PASSWORD': os.getenv('DATABASE_TEST_PASSWORD', Config.DB.get('PASSWORD')),
        'NAME': os.getenv('DATABASE_TEST_NAME', Config.DB.get('NAME')),
        'HOST': os.getenv('DATABASE_TEST_HOST', Config.DB.get('HOST')),
        'PORT': os.getenv('DATABASE_TEST_PORT', Config.DB.get('PORT')),
    }


class ProdConfig(Config):  # pylint: disable=too-few-public-methods
    """Production Config."""

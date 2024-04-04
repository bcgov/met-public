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
"""All of the configuration for the service is captured here.

All items are loaded,
or have Constants defined here that are loaded into the Flask configuration.
All modules and lookups get their configuration from the Flask config,
rather than reading environment variables directly or by accessing this configuration directly.
"""

import os

from typing import Union
from dotenv import find_dotenv, load_dotenv

from met_api.utils.constants import TestKeyConfig
from met_api.utils.util import is_truthy

# Search in increasingly higher folders for a .env file, then load it,
# appending any variables we find to the current environment.
load_dotenv(find_dotenv())
# remove all env variables with no text (allows for entries to be unset easily)
os.environ = {k: v for k, v in os.environ.items() if v}


def get_named_config(environment: Union[str, None]) -> '_Config':
    """
    Retrieve a configuration object by name. Used by the Flask app factory.

    :param config_name: The name of the configuration.
    :return: The requested configuration object.
    :raises: KeyError if the requested configuration is not found.
    """
    config_mapping = {
        'development': DevConfig,
        'default':   ProdConfig,
        'staging':    ProdConfig,
        'production': ProdConfig,
        'testing':    TestConfig,
        'docker':     DockerConfig,
        'migration':  MigrationConfig,
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


class _Config():  # pylint: disable=too-few-public-methods
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
    def SQLALCHEMY_DATABASE_URI(self) -> str:
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

    PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

    # Used for session management. Randomized by default for security, but
    # should be set to a fixed value in production to avoid invalidating sessions.
    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))

    # If enabled, Exceptions are propagated up, instead of being handled
    # by the the app’s error handlers. Enable this for tests.
    TESTING = env_truthy('FLASK_TESTING', default=False)

    # If enabled, the interactive debugger will be shown for any
    # unhandled Exceptions, and the server will be reloaded when code changes.
    USE_DEBUG = env_truthy('FLASK_DEBUG', default=False)

    # PostgreSQL configuration
    DB_CONFIG = DB = {
        'USER': os.getenv('DATABASE_USERNAME', ''),
        'PASSWORD': os.getenv('DATABASE_PASSWORD', ''),
        'NAME': os.getenv('DATABASE_NAME', ''),
        'HOST': os.getenv('DATABASE_HOST', ''),
        'PORT': os.getenv('DATABASE_PORT', '5432'),
    }

    # SQLAlchemy settings
    # Echoes the SQL queries generated - useful for debugging
    SQLALCHEMY_ECHO = env_truthy('SQLALCHEMY_ECHO')
    # Disable modification tracking for performance
    SQLALCHEMY_TRACK_MODIFICATIONS = env_truthy('SQLALCHEMY_TRACK_MODIFICATIONS')

    # Keycloak configuration
    KEYCLOAK_CONFIG = KC = {
        'BASE_URL': os.getenv('KEYCLOAK_BASE_URL', ''),
        'REALMNAME': os.getenv('KEYCLOAK_REALMNAME', 'standard'),
        'SERVICE_ACCOUNT_ID': os.getenv('MET_ADMIN_CLIENT_ID'),
        'SERVICE_ACCOUNT_SECRET': os.getenv('MET_ADMIN_CLIENT_SECRET'),
        'ADMIN_USERNAME': os.getenv('MET_ADMIN_CLIENT_ID'),
        'ADMIN_SECRET': os.getenv('MET_ADMIN_CLIENT_SECRET'),
        'CONNECT_TIMEOUT': int(os.getenv('KEYCLOAK_CONNECT_TIMEOUT', '60')),
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

    # The following are the paths used in the email templates. They do not
    # determine the actual paths used in the application. They are used to
    # construct the links in the emails sent to users.
    PATH_CONFIG = PATHS = {
        'SITE': os.getenv('SITE_URL'),
        'SUBSCRIBE': os.getenv(
            'SUBSCRIBE_PATH', '/engagements/{engagement_id}/subscribe/{token}'
        ),
        'UNSUBSCRIBE': os.getenv(
            'UNSUBSCRIBE_PATH', '/engagements/{engagement_id}/unsubscribe/{participant_id}'
        ),
        'ENGAGEMENT': {
            'VIEW': os.getenv('ENGAGEMENT_PATH', '/engagements/{engagement_id}/view'),
            'SLUG': os.getenv('ENGAGEMENT_PATH_SLUG', '/{slug}'),
            'DASHBOARD': os.getenv(
                'ENGAGEMENT_DASHBOARD_PATH', '/engagements/{engagement_id}/comments/public'
            ),
            'DASHBOARD_SLUG': os.getenv(
                'ENGAGEMENT_DASHBOARD_PATH_SLUG', '/{slug}/comments/public'
            ),
        }
    }

    # Templates for sending users various notifications by email.
    EMAIL_TEMPLATES = {
        # The time of day when engagements get closed. This should match the
        # value in met-cron/cron/crontab
        'CLOSING_TIME': os.getenv('ENGAGEMENT_END_TIME', '5 PM'),
        'FROM_ADDRESS': os.getenv('EMAIL_FROM_ADDRESS'),
        'ENVIRONMENT': os.getenv('EMAIL_ENVIRONMENT'),
        'CLOSEOUT': {
            'ID': os.getenv('CLOSEOUT_EMAIL_TEMPLATE_ID'),
            'SUBJECT': os.getenv('CLOSEOUT_EMAIL_SUBJECT',
                                 'The public commenting period for {engagement_name} is now closed.'),
        },
        'CLOSING_SOON': {
            'ID': os.getenv('CLOSING_SOON_EMAIL_TEMPLATE_ID'),
            'SUBJECT': os.getenv('CLOSING_SOON_EMAIL_SUBJECT',
                                 'Public comment period closes in 2 days'),
        },
        'PUBLISH': {
            'ID': os.getenv('PUBLISH_EMAIL_TEMPLATE_ID'),
            'SUBJECT': os.getenv('PUBLISH_EMAIL_SUBJECT', 'Share your feedback'),
        }
    }

    # The secret key used for encryption when sending emails to participants.
    EMAIL_SECRET_KEY = os.getenv('EMAIL_SECRET_KEY', os.urandom(24))

    # Single tenant environment mode - disables certain checks for user
    # permissions and tenant access. When enabled, all users are assumed to
    # have access to all tenants. Will probably cause bugs if enabled.
    IS_SINGLE_TENANT_ENVIRONMENT = env_truthy('IS_SINGLE_TENANT_ENVIRONMENT')

    # The API endpoint used to send emails to participants.
    NOTIFICATIONS_EMAIL_ENDPOINT = os.getenv('NOTIFICATIONS_EMAIL_ENDPOINT')

    # config for comment_redact_service
    N_DAYS = os.getenv('N_DAYS', 14)
    REDACTION_TEXT = os.getenv('REDACTION_TEXT', '[Comment Redacted]')

    # config for email queue
    MAIL_BATCH_SIZE = os.getenv('MAIL_BATCH_SIZE', 10)

    # config for offset days to send reminder emails
    OFFSET_DAYS = os.getenv('OFFSET_DAYS', 2)

class MigrationConfig():  # pylint: disable=too-few-public-methods
    """Base class configuration that should set reasonable defaults for all the other configurations."""

    # SQLAlchemy settings
    # Echoes the SQL queries generated - useful for debugging
    SQLALCHEMY_ECHO = env_truthy('SQLALCHEMY_ECHO', True)
    # Disable modification tracking for performance
    SQLALCHEMY_TRACK_MODIFICATIONS = env_truthy('SQLALCHEMY_TRACK_MODIFICATIONS', True)


class DevConfig(_Config):  # pylint: disable=too-few-public-methods
    """Dev Config."""

    # Default to using the debugger for development
    USE_DEBUG = env_truthy('USE_DEBUG', True)


class TestConfig(_Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""

    def __init__(self) -> None:
        """
        Initialize the object.

        This method is called when an object is created. It sets up the initial
        state of the object.

        """
        super().__init__()

        # Override Keycloak variables here
        self.KC['ADMIN_USERNAME'] = os.getenv(
            'KEYCLOAK_TEST_ADMIN_CLIENTID',
            self.KC['ADMIN_USERNAME']
        )
        self.KC['ADMIN_SECRET'] = os.getenv(
            'KEYCLOAK_TEST_ADMIN_SECRET',
            self.KC['ADMIN_SECRET']
        )
        self.KC['BASE_URL'] = os.getenv('KEYCLOAK_TEST_BASE_URL', self.KC['BASE_URL'])
        self.KC['REALMNAME'] = os.getenv('KEYCLOAK_TEST_REALMNAME', self.KC['REALMNAME'])

    # Propagate exceptions up to the test runner
    TESTING = env_truthy('FLASK_TESTING', default=True)
    # explicitly disable the debugger; we want the tests to fail if an
    # unhandled exception occurs
    USE_DEBUG = False

    # Override the DB config to use the test database, if one is configured
    DB_CONFIG = {
        'USER': os.getenv('DATABASE_TEST_USERNAME', _Config.DB.get('USER')),
        'PASSWORD': os.getenv('DATABASE_TEST_PASSWORD', _Config.DB.get('PASSWORD')),
        'NAME': os.getenv('DATABASE_TEST_NAME', _Config.DB.get('NAME')),
        'HOST': os.getenv('DATABASE_TEST_HOST', _Config.DB.get('HOST')),
        'PORT': os.getenv('DATABASE_TEST_PORT', _Config.DB.get('PORT')),
    }

    # JWT OIDC settings
    # JWT OIDC Settings for the test environment
    JWT_OIDC_TEST_MODE = True  # enables the test mode for flask_jwt_oidc
    JWT_OIDC_TEST_AUDIENCE = os.getenv('JWT_OIDC_TEST_AUDIENCE')
    JWT_OIDC_TEST_CLIENT_SECRET = os.getenv('JWT_OIDC_TEST_CLIENT_SECRET')
    JWT_OIDC_TEST_ISSUER = os.getenv('JWT_OIDC_TEST_ISSUER')
    JWT_OIDC_TEST_ALGORITHMS = os.getenv('JWT_OIDC_TEST_ALGORITHMS')
    JWT_OIDC_TEST_KEYS = {
        'keys': [
            {
                'kid': 'met-web',
                'kty': 'RSA',
                'alg': 'RS256',
                'use': 'sig',
                'n': 'AN-fWcpCyE5KPzHDjigLaSUVZI0uYrcGcc40InVtl-rQRDmAh-C2W8H4_Hxhr5VLc6crsJ2LiJTV_E72S03pzpOOaaYV6-'
                     'TzAjCou2GYJIXev7f6Hh512PuG5wyxda_TlBSsI-gvphRTPsKCnPutrbiukCYrnPuWxX5_cES9eStR',
                'e': 'AQAB'
            }
        ]
    }

    JWT_OIDC_TEST_PRIVATE_KEY_JWKS = {
        'keys': [
            {
                'kid': 'met-web',
                'kty': 'RSA',
                'alg': 'RS256',
                'use': 'sig',
                'n': 'AN-fWcpCyE5KPzHDjigLaSUVZI0uYrcGcc40InVtl-rQRDmAh-C2W8H4_Hxhr5VLc6crsJ2LiJTV_E72S03pzpOOaaYV6-'
                     'TzAjCou2GYJIXev7f6Hh512PuG5wyxda_TlBSsI-gvphRTPsKCnPutrbiukCYrnPuWxX5_cES9eStR',
                'e': 'AQAB',
                'd': 'C0G3QGI6OQ6tvbCNYGCqq043YI_8MiBl7C5dqbGZmx1ewdJBhMNJPStuckhskURaDwk4-'
                     '8VBW9SlvcfSJJrnZhgFMjOYSSsBtPGBIMIdM5eSKbenCCjO8Tg0BUh_'
                     'xa3CHST1W4RQ5rFXadZ9AeNtaGcWj2acmXNO3DVETXAX3x0',
                'p': 'APXcusFMQNHjh6KVD_hOUIw87lvK13WkDEeeuqAydai9Ig9JKEAAfV94W6Aftka7tGgE7ulg1vo3eJoLWJ1zvKM',
                'q': 'AOjX3OnPJnk0ZFUQBwhduCweRi37I6DAdLTnhDvcPTrrNWuKPg9uGwHjzFCJgKd8KBaDQ0X1rZTZLTqi3peT43s',
                'dp': 'AN9kBoA5o6_Rl9zeqdsIdWFmv4DB5lEqlEnC7HlAP-3oo3jWFO9KQqArQL1V8w2D4aCd0uJULiC9pCP7aTHvBhc',
                'dq': 'ANtbSY6njfpPploQsF9sU26U0s7MsuLljM1E8uml8bVJE1mNsiu9MgpUvg39jEu9BtM2tDD7Y51AAIEmIQex1nM',
                'qi': 'XLE5O360x-MhsdFXx8Vwz4304-MJg-oGSJXCK_ZWYOB_FGXFRTfebxCsSYi0YwJo-oNu96bvZCuMplzRI1liZw'
            }
        ]
    }

    JWT_OIDC_TEST_PRIVATE_KEY_PEM = """
    -----BEGIN RSA PRIVATE KEY-----
    MIICXQIBAAKBgQDfn1nKQshOSj8xw44oC2klFWSNLmK3BnHONCJ1bZfq0EQ5gIfg
    tlvB+Px8Ya+VS3OnK7Cdi4iU1fxO9ktN6c6TjmmmFevk8wIwqLthmCSF3r+3+h4e
    ddj7hucMsXWv05QUrCPoL6YUUz7Cgpz7ra24rpAmK5z7lsV+f3BEvXkrUQIDAQAB
    AoGAC0G3QGI6OQ6tvbCNYGCqq043YI/8MiBl7C5dqbGZmx1ewdJBhMNJPStuckhs
    kURaDwk4+8VBW9SlvcfSJJrnZhgFMjOYSSsBtPGBIMIdM5eSKbenCCjO8Tg0BUh/
    xa3CHST1W4RQ5rFXadZ9AeNtaGcWj2acmXNO3DVETXAX3x0CQQD13LrBTEDR44ei
    lQ/4TlCMPO5bytd1pAxHnrqgMnWovSIPSShAAH1feFugH7ZGu7RoBO7pYNb6N3ia
    C1idc7yjAkEA6Nfc6c8meTRkVRAHCF24LB5GLfsjoMB0tOeEO9w9Ous1a4o+D24b
    AePMUImAp3woFoNDRfWtlNktOqLel5PjewJBAN9kBoA5o6/Rl9zeqdsIdWFmv4DB
    5lEqlEnC7HlAP+3oo3jWFO9KQqArQL1V8w2D4aCd0uJULiC9pCP7aTHvBhcCQQDb
    W0mOp436T6ZaELBfbFNulNLOzLLi5YzNRPLppfG1SRNZjbIrvTIKVL4N/YxLvQbT
    NrQw+2OdQACBJiEHsdZzAkBcsTk7frTH4yGx0VfHxXDPjfTj4wmD6gZIlcIr9lZg
    4H8UZcVFN95vEKxJiLRjAmj6g273pu9kK4ymXNEjWWJn
    -----END RSA PRIVATE KEY-----"""

    JWT_OIDC_AUDIENCE = os.getenv('JWT_OIDC_TEST_AUDIENCE')
    JWT_OIDC_CLIENT_SECRET = os.getenv('JWT_OIDC_TEST_CLIENT_SECRET')
    JWT_OIDC_ISSUER = os.getenv('JWT_OIDC_TEST_ISSUER')

    # If any value is present in this flag, starts up a keycloak docker
    USE_TEST_KEYCLOAK_DOCKER = os.getenv('USE_TEST_KEYCLOAK_DOCKER', None)
    USE_DOCKER_MOCK = os.getenv('USE_DOCKER_MOCK', None)


class DockerConfig(_Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""

    # Override DB config to use the docker database, if one is configured
    DB_CONFIG = {
        'USER': os.getenv('DATABASE_DOCKER_USERNAME', _Config.DB.get('USER')),
        'PASSWORD': os.getenv('DATABASE_DOCKER_PASSWORD', _Config.DB.get('PASSWORD')),
        'NAME': os.getenv('DATABASE_DOCKER_NAME', _Config.DB.get('NAME')),
        'HOST': os.getenv('DATABASE_DOCKER_HOST', _Config.DB.get('HOST')),
        'PORT': os.getenv('DATABASE_DOCKER_PORT', _Config.DB.get('PORT')),
    }


class ProdConfig(_Config):  # pylint: disable=too-few-public-methods
    """Production Config."""

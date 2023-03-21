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
import sys

from dotenv import find_dotenv, load_dotenv

# this will load all the envars from a .env file located in the project root (api)
load_dotenv(find_dotenv())


def get_named_config(config_name: str = 'development'):
    """Return the configuration object based on the name.

    :raise: KeyError: if an unknown configuration is requested
    """
    if config_name in ['production', 'staging', 'default']:
        config = ProdConfig()
    elif config_name == 'testing':
        config = TestConfig()
    elif config_name == 'development':
        config = DevConfig()
    elif config_name == 'docker':
        config = DockerConfig()
    else:
        raise KeyError("Unknown configuration '{config_name}'")
    return config


class _Config():  # pylint: disable=too-few-public-methods
    """Base class configuration that should set reasonable defaults for all the other configurations."""

    PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

    SECRET_KEY = 'a secret'

    TESTING = False
    DEBUG = False

    # POSTGRESQL
    DB_USER = os.getenv('DATABASE_USERNAME', '')
    DB_PASSWORD = os.getenv('DATABASE_PASSWORD', '')
    DB_NAME = os.getenv('DATABASE_NAME', '')
    DB_HOST = os.getenv('DATABASE_HOST', '')
    DB_PORT = os.getenv('DATABASE_PORT', '5432')
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{int(DB_PORT)}/{DB_NAME}'
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT_OIDC Settings
    JWT_OIDC_WELL_KNOWN_CONFIG = os.getenv('JWT_OIDC_WELL_KNOWN_CONFIG')
    JWT_OIDC_ALGORITHMS = os.getenv('JWT_OIDC_ALGORITHMS', 'RS256')
    JWT_OIDC_JWKS_URI = os.getenv('JWT_OIDC_JWKS_URI')
    JWT_OIDC_ISSUER = os.getenv('JWT_OIDC_ISSUER')
    JWT_OIDC_AUDIENCE = os.getenv('JWT_OIDC_AUDIENCE', 'account')
    JWT_OIDC_CACHING_ENABLED = os.getenv('JWT_OIDC_CACHING_ENABLED', 'True')
    JWT_OIDC_JWKS_CACHE_TIMEOUT = 300

    S3_BUCKET = os.getenv('S3_BUCKET')
    S3_ACCESS_KEY_ID = os.getenv('S3_ACCESS_KEY_ID')
    S3_SECRET_ACCESS_KEY = os.getenv('S3_SECRET_ACCESS_KEY')
    S3_HOST = os.getenv('S3_HOST')
    S3_REGION = os.getenv('S3_REGION')
    S3_SERVICE = os.getenv('S3_SERVICE')

    # Service account details
    KEYCLOAK_BASE_URL = os.getenv('KEYCLOAK_BASE_URL')
    KEYCLOAK_REALMNAME = os.getenv('KEYCLOAK_REALMNAME', 'met')
    KEYCLOAK_SERVICE_ACCOUNT_ID = os.getenv('MET_ADMIN_CLIENT_ID')
    KEYCLOAK_SERVICE_ACCOUNT_SECRET = os.getenv('MET_ADMIN_CLIENT_SECRET')
    # TODO separate out clients for APIs and user management.
    # TODO API client wont need user management roles in keycloak.
    KEYCLOAK_ADMIN_USERNAME = os.getenv('MET_ADMIN_CLIENT_ID')
    KEYCLOAK_ADMIN_SECRET = os.getenv('MET_ADMIN_CLIENT_SECRET')

    # front end urls
    SUBMISSION_PATH = os.getenv('SUBMISSION_PATH', '/engagements/{engagement_id}/edit/{token}')
    SURVEY_PATH = os.getenv('SURVEY_PATH', '/surveys/submit/{survey_id}/{token}')
    SUBSCRIBE_PATH = os.getenv('SUBSCRIBE_PATH', '/engagements/{engagement_id}/subscribe/{token}')
    # engagement dashboard path is used to pass the survey result to the public user.
    # The link is changed such that public user can access the comments page from the email and not the dashboard.
    ENGAGEMENT_DASHBOARD_PATH = os.getenv('ENGAGEMENT_DASHBOARD_PATH', '/engagements/{engagement_id}/comments')
    USER_MANAGEMENT_PATH = os.getenv('USER_MANAGEMENT_PATH', '/usermanagement')
    SITE_URL = os.getenv('SITE_URL')

    # The GC notify email variables
    # Email address verification
    VERIFICATION_EMAIL_TEMPLATE_ID = os.getenv('VERIFICATION_EMAIL_TEMPLATE_ID')
    VERIFICATION_EMAIL_SUBJECT = os.getenv('VERIFICATION_EMAIL_SUBJECT', '{engagement_name} - Survey link')
    # Email address verification
    SUBSCRIBE_EMAIL_TEMPLATE_ID = os.getenv('SUBSCRIBE_EMAIL_TEMPLATE_ID')
    SUBSCRIBE_EMAIL_SUBJECT = os.getenv('SUBSCRIBE_EMAIL_SUBJECT', 'Confirm your Subscription to {engagement_name}')
    # Rejected comments
    REJECTED_EMAIL_TEMPLATE_ID = os.getenv('REJECTED_EMAIL_TEMPLATE_ID')
    REJECTED_EMAIL_SUBJECT = os.getenv('REJECTED_EMAIL_SUBJECT', '{engagement_name} - About your Comments')
    # New User Registration
    ACCESS_REQUEST_EMAIL_TEMPLATE_ID = os.getenv('ACCESS_REQUEST_EMAIL_TEMPLATE_ID')
    ACCESS_REQUEST_EMAIL_SUBJECT = os.getenv('ACCESS_REQUEST_EMAIL_SUBJECT', 'MET - New User Access Request')
    ACCESS_REQUEST_EMAIL_ADDRESS = os.getenv('ACCESS_REQUEST_EMAIL_ADDRESS')

    NOTIFICATIONS_EMAIL_ENDPOINT = os.getenv('NOTIFICATIONS_EMAIL_ENDPOINT')
    # CDOGS
    CDOGS_ACCESS_TOKEN = os.getenv('CDOGS_ACCESS_TOKEN')
    CDOGS_BASE_URL = os.getenv('CDOGS_BASE_URL')
    CDOGS_SERVICE_CLIENT = os.getenv('CDOGS_SERVICE_CLIENT')
    CDOGS_SERVICE_CLIENT_SECRET = os.getenv('CDOGS_SERVICE_CLIENT_SECRET')
    CDOGS_TOKEN_URL = os.getenv('CDOGS_TOKEN_URL')

    SHAPEFILE_UPLOAD_FOLDER = os.getenv('SHAPEFILE_UPLOAD_FOLDER', '/tmp/uploads')


class DevConfig(_Config):  # pylint: disable=too-few-public-methods
    """Dev Config."""

    TESTING = False
    DEBUG = True
    print(f'SQLAlchemy URL (DevConfig): {_Config.SQLALCHEMY_DATABASE_URI}')


class TestConfig(_Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""

    DEBUG = True
    TESTING = True
    DEBUG = True
    TESTING = True
    # POSTGRESQL
    DB_USER = os.getenv('DATABASE_TEST_USERNAME', 'postgres')
    DB_PASSWORD = os.getenv('DATABASE_TEST_PASSWORD', 'postgres')
    DB_NAME = os.getenv('DATABASE_TEST_NAME', 'postgres')
    DB_HOST = os.getenv('DATABASE_TEST_HOST', 'localhost')
    DB_PORT = os.getenv('DATABASE_TEST_PORT', '5432')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_TEST_URL',
                                        f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{int(DB_PORT)}/{DB_NAME}')

    # JWT OIDC settings
    # JWT_OIDC_TEST_MODE will set jwt_manager to use
    JWT_OIDC_TEST_MODE = True
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

    KEYCLOAK_ADMIN_USERNAME = os.getenv('KEYCLOAK_TEST_ADMIN_CLIENTID', 'met-admin')
    KEYCLOAK_ADMIN_SECRET = os.getenv('KEYCLOAK_TEST_ADMIN_SECRET', '2222222222')
    KEYCLOAK_BASE_URL = os.getenv('KEYCLOAK_TEST_BASE_URL', 'http://localhost:8088')
    KEYCLOAK_REALMNAME = os.getenv('KEYCLOAK_TEST_REALMNAME', 'demo')

    JWT_OIDC_AUDIENCE = os.getenv('JWT_OIDC_TEST_AUDIENCE')
    JWT_OIDC_CLIENT_SECRET = os.getenv('JWT_OIDC_TEST_CLIENT_SECRET')
    JWT_OIDC_ISSUER = os.getenv('JWT_OIDC_TEST_ISSUER')
    # Service account details
    KEYCLOAK_SERVICE_ACCOUNT_ID = os.getenv('KEYCLOAK_TEST_ADMIN_CLIENTID')
    KEYCLOAK_SERVICE_ACCOUNT_SECRET = os.getenv('KEYCLOAK_TEST_ADMIN_SECRET')

    # Legal-API URL
    LEGAL_API_URL = 'https://mock-auth-tools.pathfinder.gov.bc.ca/rest/legal-api/2.7/api/v1'

    NOTIFY_API_URL = 'http://localhost:8080/notify-api/api/v1'
    BCOL_API_URL = 'http://localhost:8080/bcol-api/api/v1'
    PAY_API_URL = 'http://localhost:8080/pay-api/api/v1'
    PAY_API_SANDBOX_URL = 'http://localhost:8080/pay-api/api/v1'

    # If any value is present in this flag, starts up a keycloak docker
    USE_TEST_KEYCLOAK_DOCKER = os.getenv('USE_TEST_KEYCLOAK_DOCKER', None)
    USE_DOCKER_MOCK = os.getenv('USE_DOCKER_MOCK', None)
    PROPAGATE_EXCEPTIONS = True


class DockerConfig(_Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""

    # POSTGRESQL
    DB_USER = os.getenv('DATABASE_DOCKER_USERNAME')
    DB_PASSWORD = os.getenv('DATABASE_DOCKER_PASSWORD')
    DB_NAME = os.getenv('DATABASE_DOCKER_NAME')
    DB_HOST = os.getenv('DATABASE_DOCKER_HOST')
    DB_PORT = os.getenv('DATABASE_DOCKER_PORT', '5432')
    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{int(DB_PORT)}/{DB_NAME}'

    print(f'SQLAlchemy URL (Docker): {SQLALCHEMY_DATABASE_URI}')


class ProdConfig(_Config):  # pylint: disable=too-few-public-methods
    """Production Config."""

    SECRET_KEY = os.getenv('SECRET_KEY', None)

    if not SECRET_KEY:
        SECRET_KEY = os.urandom(24)
        print('WARNING: SECRET_KEY being set as a one-shot', file=sys.stderr)

    TESTING = False
    DEBUG = False

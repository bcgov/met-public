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

    ALEMBIC_INI = 'migrations/alembic.ini'
    # Config to skip migrations when alembic migrate is used
    SKIPPED_MIGRATIONS = ['authorizations_view']

    # POSTGRESQL
    DB_USER = os.getenv('DATABASE_USERNAME')
    DB_PASSWORD = os.getenv('DATABASE_PASSWORD')
    DB_NAME = os.getenv('DATABASE_NAME')
    DB_HOST = os.getenv('DATABASE_HOST')
    DB_PORT = os.getenv('DATABASE_PORT', '5432')
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}'.format(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=int(DB_PORT),
        name=DB_NAME,
    )
    
    print('SQLAlchemy URL (_Config): ')
    
class DevConfig(_Config):  # pylint: disable=too-few-public-methods
    """Dev Config."""

    TESTING = False
    DEBUG = True
    print('SQLAlchemy URL (DevConfig): ')
    

class TestConfig(_Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""

    DEBUG = True
    TESTING = True
    print('SQLAlchemy URL (TestConfig): ')
    
class DockerConfig(_Config):  # pylint: disable=too-few-public-methods
    """In support of testing only.used by the py.test suite."""
    # POSTGRESQL
    DB_USER = os.getenv('DATABASE_DOCKER_USERNAME')
    DB_PASSWORD = os.getenv('DATABASE_DOCKER_PASSWORD')
    DB_NAME = os.getenv('DATABASE_DOCKER_NAME')
    DB_HOST = os.getenv('DATABASE_DOCKER_HOST')
    DB_PORT = os.getenv('DATABASE_DOCKER_PORT', '5432')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_DOCKER_URL',
                                        'postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}'.format(
                                            user=DB_USER,
                                            password=DB_PASSWORD,
                                            host=DB_HOST,
                                            port=int(DB_PORT),
                                            name=DB_NAME,
                                        ))
    
    print('SQLAlchemy URL (Docker): {}'.format(SQLALCHEMY_DATABASE_URI))
    
class ProdConfig(_Config):  # pylint: disable=too-few-public-methods
    # production config       
    print('SQLAlchemy URL (ProdConfig): ')
    pass


    

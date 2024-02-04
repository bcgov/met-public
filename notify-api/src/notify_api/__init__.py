# Copyright © 2019 Province of British Columbia
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
"""The report Microservice.This module is the API for the Legal Entity system."""

import os
from flask import Flask

from notify_api.auth import jwt as jwt_manager
from notify_api.config import get_named_config
from notify_api.resources import API


def create_app(run_mode=os.getenv('FLASK_ENV', 'production')):
    """Return a configured Flask App using the Factory method."""
    app = Flask(__name__)
    # All configuration are in config file
    app.config.from_object(get_named_config(run_mode))
    API.init_app(app)
    setup_jwt_manager(app)

    @app.after_request
    def add_version(response):  # pylint:  disable=unused-variable
        version = os.getenv('OPENSHIFT_BUILD_COMMIT', '')
        response.headers['API'] = f'notifications_api/{version}'
        return response

    register_shellcontext(app)

    return app


def setup_jwt_manager(app):
    """Use flask app to configure the JWTManager to work for a particular Realm."""

    def get_roles(a_dict):
        return a_dict['client_roles']  # pragma: no cover

    app.config['JWT_ROLE_CALLBACK'] = get_roles

    jwt_manager.init_app(app)


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {'app': app}  # pragma: no cover

    app.shell_context_processor(shell_context)

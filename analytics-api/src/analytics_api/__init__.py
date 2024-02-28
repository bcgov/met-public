"""The App Initiation file.

This module is for the initiation of the flask app.
"""

import os

import secure
from flask import Flask, g, request
from flask_cors import CORS

from analytics_api.auth import jwt
from analytics_api.config import get_named_config
from analytics_api.models import db, ma, migrate


hsts = secure.StrictTransportSecurity().include_subdomains().preload().max_age(31536000)
referrer = secure.ReferrerPolicy().no_referrer()
cache_value = secure.CacheControl().no_store().max_age(0)
xfo_value = secure.XFrameOptions().deny()
secure_headers = secure.Secure(
    hsts=hsts,
    referrer=referrer,
    cache=cache_value,
    xfo=xfo_value
)


# All Apps routes are registered here
def create_app(run_mode=os.getenv('FLASK_ENV', 'development')):
    """Create flask app."""
    from analytics_api.resources import API_BLUEPRINT  # pylint: disable=import-outside-toplevel

    # Flask app initialize
    app = Flask(__name__)

    # All configuration are in config file
    app.config.from_object(get_named_config(run_mode))

    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)

    # Register blueprints
    app.register_blueprint(API_BLUEPRINT)

    # Setup jwt for keycloak
    if os.getenv('FLASK_ENV', 'production') != 'testing':
        setup_jwt_manager(app, jwt)

    # Database connection initialize
    db.init_app(app)

    # Database migrate initialize
    migrate.init_app(app, db)

    # Marshmallow initialize
    ma.init_app(app)

    @app.before_request
    def set_origin():
        g.origin_url = request.environ.get('HTTP_ORIGIN', 'localhost')

    @app.after_request
    def set_secure_headers(response):
        """Set CORS headers for security."""
        secure_headers.framework.flask(response)
        response.headers.add('Cross-Origin-Resource-Policy', '*')
        response.headers['Cross-Origin-Opener-Policy'] = '*'
        response.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
        return response

    # Return App for run in run.py file
    return app


def setup_jwt_manager(app_context, jwt_manager):
    """Use flask app to configure the JWTManager to work for a particular Realm."""

    def get_roles(token_info) -> list:
        """
        Consumes a token_info dictionary and returns a list of roles.

        Uses a configurable path to the roles in the token_info dictionary.
        """
        role_access_path = app_context.config['JWT_CONFIG']['ROLE_CLAIM']
        for key in role_access_path.split('.'):
            token_info = token_info.get(key, None)
            if token_info is None:
                app_context.logger.warning('Unable to find role in token_info. '
                                           'Please check your JWT_ROLE_CALLBACK '
                                           'configuration.')
                return []
        return token_info

    app_context.config['JWT_ROLE_CALLBACK'] = get_roles
    jwt_manager.init_app(app_context)

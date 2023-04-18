"""The App Initiation file.

This module is for the initiation of the flask app.
"""

import os

import secure
from flask import Flask, current_app, g, request
from flask_cors import CORS

from met_api.auth import jwt
from met_api.config import get_named_config
from met_api.models import db, ma, migrate
from met_api.models.tenant import Tenant as TenantModel
from met_api.utils.cache import cache

# Security Response headers
csp = (
    secure.ContentSecurityPolicy()
    .default_src("'self'")
    .script_src("'self'")
    .object_src('self')
    .connect_src('self')
)

hsts = secure.StrictTransportSecurity().include_subdomains().preload().max_age(31536000)
referrer = secure.ReferrerPolicy().no_referrer()
cache_value = secure.CacheControl().no_store().max_age(0)
xfo_value = secure.XFrameOptions().deny()
secure_headers = secure.Secure(
    csp=csp,
    hsts=hsts,
    referrer=referrer,
    cache=cache_value,
    xfo=xfo_value
)


def create_app(run_mode=os.getenv('FLASK_ENV', 'development')):
    """Create flask app."""
    from met_api.resources import API_BLUEPRINT  # pylint: disable=import-outside-toplevel

    # Flask app initialize
    app = Flask(__name__)

    # All configuration are in config file
    app.config.from_object(get_named_config(run_mode))

    CORS(app, supports_credentials=True)

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

    build_cache(app)

    @app.before_request
    def set_tenant_id():
        """Set Tenant ID Globally."""
        tenant_short_name = request.headers.get('tenant-id', None)
        if not tenant_short_name:
            return

        key = tenant_short_name.upper()
        tenant = cache.get(f'tenant_{key}')
        cache_miss = not tenant
        if cache_miss:
            tenant: TenantModel = TenantModel.find_by_short_name(tenant_short_name)
            if not tenant:
                return
            key = tenant.short_name.upper()
            cache.set(f'tenant_{key}', tenant)
        g.tenant_id = tenant.id
        g.tenant_name = key

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


def build_cache(app):
    """Build cache."""
    cache.init_app(app)
    with app.app_context():
        cache.clear()
        try:
            from met_api.services.tenant_service import TenantService  # pylint: disable=import-outside-toplevel
            TenantService.build_all_tenant_cache()
        except Exception as e:  # NOQA # pylint:disable=broad-except
            current_app.logger.error('Error on caching ')
            current_app.logger.error(e)


def setup_jwt_manager(app_context, jwt_manager):
    """Use flask app to configure the JWTManager to work for a particular Realm."""

    def get_roles(a_dict):
        return a_dict['realm_access']['roles']  # pragma: no cover

    app_context.config['JWT_ROLE_CALLBACK'] = get_roles
    jwt_manager.init_app(app_context)

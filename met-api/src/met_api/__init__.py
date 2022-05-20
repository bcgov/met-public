import os

import secure
from flask import Flask
from flask_cors import CORS

from met_api.auth import jwt
from met_api.config import get_named_config
from met_api.models import db, ma, migrate
from met_api.resources import API_BLUEPRINT


# Flask app initialize
app = Flask(__name__)

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

@app.after_request
def set_secure_headers(response):
    """Set CORS headers for security."""
    secure_headers.framework.flask(response)
    response.headers.add('Cross-Origin-Resource-Policy', 'same-origin')
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'unsafe-none'
    return response

# All Apps routes are registered here
def create_app(run_mode=os.getenv('FLASK_ENV', 'development')):
    """Creating flask app."""

    # All configuration are in config file
    app.config.from_object(get_named_config(run_mode))

    # Register blueprints
    app.register_blueprint(API_BLUEPRINT)

    # Setup jwt for keycloak
    if os.getenv('FLASK_ENV', 'production') != 'testing':
        print("JWTSET DONE!!!!!!!!!!!!!!!!")
        setup_jwt_manager(app, jwt)

    CORS(app, supports_credentials=True)

    # Database connection initialize
    db.init_app(app)

    # Database migrate initialize
    migrate.init_app(app, db)

    # Marshmallow initialize
    ma.init_app(app)

    # Return App for run in run.py file
    return app

def setup_jwt_manager(app, jwt_manager):
    """Use flask app to configure the JWTManager to work for a particular Realm."""

    def get_roles(a_dict):
        return a_dict['realm_access']['roles']  # pragma: no cover

    app.config['JWT_ROLE_CALLBACK'] = get_roles

    jwt_manager.init_app(app)
    
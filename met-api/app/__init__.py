from flask import Flask
from app.models import db, migrate, ma
from app.resources import API_BLUEPRINT
from app.config import get_named_config
import os

# All Apps routes are registered here
def create_app(
        run_mode=os.getenv('FLASK_ENV', 'development'),
        url_prefix=os.getenv('URL_PREFIX', '/api/')
    ):
    # Flask app initialize
    app = Flask(__name__)

    # All configuration are in config file
    app.config.from_object(get_named_config(run_mode))

    # Register blueprints
    app.register_blueprint(API_BLUEPRINT, url_prefix=url_prefix)

    # Database connection initialize
    db.init_app(app)

    # Database migrate initialize
    migrate.init_app(app, db)

    # Marshmallow initialize
    ma.init_app(app)

    # Return App for run in run.py file
    return app
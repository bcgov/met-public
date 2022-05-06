from flask import Flask
from App.Api.models import db, migrate, ma
from App.Api.resources import API_BLUEPRINT
# from App.Api.routerr import api


# All Apps routes are registered here
def create_app(config_file="config.py"):
    # Flask app initialize
    app = Flask(__name__)

    # All configuration are in config file
    app.config.from_pyfile(config_file)

    # Register blueprints
    app.register_blueprint(API_BLUEPRINT)

    # Database connection initialize
    db.init_app(app)

    # Database migrate initialize
    migrate.init_app(app, db)

    # Marshmallow initialize
    ma.init_app(app)

    # Return App for run in run.py file
    return app


# if __name__ == "__main__":
#     create_app().run(debug=True, host='0.0.0.0', port=5000)

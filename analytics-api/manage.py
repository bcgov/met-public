from flask_migrate import Migrate

from analytics_api import create_app, db

app = create_app()
# app.config.from_object(os.environ['APP_SETTINGS'])

migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run()

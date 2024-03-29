from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
import invoke_jobs

from src.met_cron.models import db

app = invoke_jobs.create_app(run_mode='migration')
# app.config.from_object(os.environ['APP_SETTINGS'])

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
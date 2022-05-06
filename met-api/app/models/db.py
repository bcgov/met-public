from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

# DB initialize in __init__ file
# db variable use for create models from here
db = SQLAlchemy()

# Migrate initialize in __init__ file
# Migrate database config
migrate = Migrate()

# Marshmallow for database model schema
ma = Marshmallow()


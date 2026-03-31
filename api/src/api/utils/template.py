"""Template Services."""

import os
from jinja2 import Environment, FileSystemLoader

templates_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..', 'templates'))
ENV = Environment(loader=FileSystemLoader(templates_dir), autoescape=True)


class Template:
    """Template helper class."""

    @staticmethod
    def get_template(template_filename):
        """Get a template from the common template folder."""
        return ENV.get_template(template_filename)

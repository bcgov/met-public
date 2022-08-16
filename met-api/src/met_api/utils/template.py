"""Template Services."""

from jinja2 import Environment, FileSystemLoader

ENV = Environment(loader=FileSystemLoader('./templates'), autoescape=True)


class Template:
    """Template helper class."""

    @staticmethod
    def get_template(template_filename):
        """Get a template from the common template folder."""
        return ENV.get_template(template_filename)

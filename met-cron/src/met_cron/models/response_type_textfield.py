"""response_type_textfield model class.

Manages the responses for a textfield type questions on a survey
"""

from .response_mixin import ResponseMixin


class ResponseTypeTextfield(ResponseMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Textfield entity."""

    __tablename__ = 'response_type_textfield'

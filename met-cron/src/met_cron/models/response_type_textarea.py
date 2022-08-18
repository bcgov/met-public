"""response_type_textarea model class.

Manages the responses for a textarea type questions on a survey
"""
from .base_model import BaseModel
from .response_mixin import ResponseMixin


class ResponseTypeTextarea(BaseModel, ResponseMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Textarea entity."""

    __tablename__ = 'response_type_textarea'

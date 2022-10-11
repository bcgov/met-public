"""response_type_option model class.

Manages the responses for a option type questions on a survey
"""
from .base_model import BaseModel
from .response_mixin import ResponseMixin


class ResponseTypeOption(BaseModel, ResponseMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Option entity."""

    __tablename__ = 'response_type_option'

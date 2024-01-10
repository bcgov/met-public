"""available_response_option model class.

Manages the Available Options for a option type questions on a survey
"""
from .base_model import BaseModel
from .response_mixin import ResponseMixin


class AvailableResponseOption(BaseModel, ResponseMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Available Response Options entity."""

    __tablename__ = 'available_response_option'

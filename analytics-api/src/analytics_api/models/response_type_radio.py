"""response_type_radio model class.

Manages the responses for a radio type questions on a survey
"""
from .base_model import BaseModel
from .response_mixin import ResponseMixin


class ResponseTypeRadio(BaseModel, ResponseMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Radio entity."""

    __tablename__ = 'response_type_radio'

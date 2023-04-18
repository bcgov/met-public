"""request_type_radio model class.

Manages the radio type questions on a survey
"""
from .base_model import BaseModel
from .request_mixin import RequestMixin


class RequestTypeRadio(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Radio entity."""

    __tablename__ = 'request_type_radio'

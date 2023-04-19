"""request_type_option model class.

Manages the option type questions on a survey
"""
from .base_model import BaseModel
from .request_mixin import RequestMixin


class RequestTypeOption(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Option entity."""

    __tablename__ = 'request_type_option'

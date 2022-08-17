"""request_type_textfield model class.

Manages the textfield type questions on a survey
"""
from .base_model import BaseModel
from .request_mixin import RequestMixin


class RequestTypeTextfield(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Textfield entity."""

    __tablename__ = 'request_type_textfield'

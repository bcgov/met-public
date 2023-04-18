"""request_type_textarea model class.

Manages the textarea type questions on a survey
"""
from .base_model import BaseModel
from .request_mixin import RequestMixin


class RequestTypeTextarea(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Textarea entity."""

    __tablename__ = 'request_type_textarea'

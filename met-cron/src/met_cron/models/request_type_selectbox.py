"""request_type_selectbox model class.

Manages the selectboxes type questions on a survey
"""
from .base_model import BaseModel
from .request_mixin import RequestMixin


class RequestTypeSelectbox(BaseModel, RequestMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Request Type Selectbox entity."""

    __tablename__ = 'request_type_selectbox'

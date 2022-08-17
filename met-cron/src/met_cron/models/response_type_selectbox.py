"""response_type_selectbox model class.

Manages the responses for a selectboxes type questions on a survey
"""
from .base_model import BaseModel
from .response_mixin import ResponseMixin


class ResponseTypeSelectbox(BaseModel, ResponseMixin):  # pylint: disable=too-few-public-methods
    """Definition of the Response Type Selectbox entity."""

    __tablename__ = 'response_type_selectbox'

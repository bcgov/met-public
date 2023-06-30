"""Report setting schema class.

Manages the report setting
"""

from met_api.models import ReportSetting as ReportSettingModel

from .base_schema import BaseSchema


class ReportSettingSchema(BaseSchema):  # pylint: disable=too-many-ancestors, too-few-public-methods
    """This is the schema for the report setting model."""

    class Meta(BaseSchema.Meta):  # pylint: disable=too-few-public-methods
        """Maps all of the report setting fields to a default schema."""

        model = ReportSettingModel

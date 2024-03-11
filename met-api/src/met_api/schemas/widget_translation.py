"""Widget translation schema class."""

from marshmallow import EXCLUDE, Schema, fields


class WidgetTranslationSchema(Schema):
    """Widget translation schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    widget_id = fields.Int(data_key='widget_id', required=True)
    language_id = fields.Int(data_key='language_id', required=True)
    title = fields.Str(data_key='title')
    map_marker_label = fields.Str(data_key='map_marker_label')
    map_file_name = fields.Str(data_key='map_file_name')
    poll_title = fields.Str(data_key='poll_title')
    poll_description = fields.Str(data_key='poll_description')
    video_url = fields.Str(data_key='video_url')
    video_description = fields.Str(data_key='video_description')

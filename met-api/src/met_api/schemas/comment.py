"""Comment model class.

Manages the comment
"""

from marshmallow import EXCLUDE, Schema, fields


class CommentSchema(Schema):
    """Schema for comment."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    text = fields.Str(data_key='text')
    submission_date = fields.Date(data_key='submission_date')
    reviewed_by = fields.Str(data_key='reviewed_by')
    review_date = fields.Str(data_key='review_date')
    status_id = fields.Int(data_key='status_id')
    survey_id = fields.Int(data_key='survey_id')
    submission_id = fields.Int(data_key='submission_id')
    status_id = fields.Method('get_comment_status_id')
    reviewed_by = fields.Method('get_comment_reviewed_by')
    label = fields.Method('get_comment_label')

    def get_comment_status_id(self, obj):
        """Get the associated status of the comment."""
        return obj.submission.comment_status_id

    def get_comment_reviewed_by(self, obj):
        """Get the associated reviewed by of the comment."""
        return obj.submission.reviewed_by

    def get_comment_label(self, obj):
        """Get the associated label of the comment."""
        components = list(obj.survey.form_json.get('components', []))
        if len(components) == 0:
            return None
        component_label = [
            component.get(
                'label',
                None) for component in components if component.get(
                'key',
                None) == obj.component_id]
        if len(component_label) == 0:
            return None
        return component_label[0]


class PublicCommentSchema(Schema):
    """Schema for public comment."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        unknown = EXCLUDE

    id = fields.Int(data_key='id')
    text = fields.Str(data_key='text')
    label = fields.Method('get_comment_label')

    def get_comment_label(self, obj):
        """Get the associated label of the comment."""
        components = list(obj.survey.form_json.get('components', []))
        if len(components) == 0:
            return None
        component_label = [
            component.get(
                'label',
                None) for component in components if component.get(
                'key',
                None) == obj.component_id]
        if len(component_label) == 0:
            return None
        return component_label[0]

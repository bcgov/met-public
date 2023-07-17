"""Widget schema class."""

from marshmallow import Schema

from met_api.models.widget_documents import WidgetDocuments as WidgetDocumentModel


class WidgetDocumentsSchema(Schema):
    """Widget Documents schema."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Exclude unknown fields in the deserialized output."""

        model = WidgetDocumentModel
        fields = ('id', 'title', 'type', 'parent_document_id', 'url', 'sort_index', 'is_uploaded')

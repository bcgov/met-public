"""Service for widget Document management."""
from http import HTTPStatus

from anytree import AnyNode
from anytree.exporter import DictExporter
from anytree.search import find_by_attr
from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget_documents import WidgetDocuments as WidgetDocumentsModel
from met_api.utils.enums import DocumentType


class WidgetDocumentService:
    """Widget Documents management service."""

    @staticmethod
    def get_documents_by_widget_id(widget_id):
        """Get documents by widget id."""
        docs = WidgetDocumentsModel.get_all_by_widget_id(widget_id)
        if not docs:
            return {}
        # create all folders structure
        root = AnyNode()
        WidgetDocumentService._attach_folder_nodes(docs, root)
        WidgetDocumentService._attach_file_nodes(docs, root)

        exporter = DictExporter()
        return exporter.export(root)

    @staticmethod
    def _attach_file_nodes(docs, root):
        files = list(filter(lambda doc: doc.type == DocumentType.FILE.value, docs))
        for file in files:
            props = WidgetDocumentService._fetch_props(file)
            parent_node = root
            if parent_id := file.parent_document_id:
                parent_node = find_by_attr(root, parent_id, name='id')
            AnyNode(**props, parent=parent_node)

    @staticmethod
    def _attach_folder_nodes(docs, root):

        folders = list(filter(lambda doc: doc.type == DocumentType.FOLDER.value, docs))
        for folder in folders:
            props = WidgetDocumentService._fetch_props(folder)
            AnyNode(**props, parent=root)

    @staticmethod
    def _fetch_props(doc):
        props = {
            'id': doc.id,
            'type': doc.type,
            'title': doc.title,
            'sort_index': doc.sort_index,
            'url': doc.url,
            'parent_document_id': doc.parent_document_id,
        }
        # remove null
        return {k: v for k, v in props.items() if v}

    @staticmethod
    def create_document(widget_id, doc_details):
        """Create documents for the widget."""
        if parent_id := (doc_details.get('parent_document_id', None)):
            WidgetDocumentService._validate_parent_type(parent_id)

        doc = WidgetDocumentService._create_document_from_dict(doc_details, parent_id, widget_id)
        doc.save()
        return doc

    @staticmethod
    def _create_document_from_dict(doc_details, parent_id, widget_id):
        doc: WidgetDocumentsModel = WidgetDocumentsModel()
        doc.type = doc_details.get('type')
        doc.title = doc_details.get('title')
        doc.parent_document_id = parent_id
        doc.url = doc_details.get('url')
        doc.widget_id = widget_id
        sort_index = WidgetDocumentService._find_highest_sort_index(widget_id)
        doc.sort_index = sort_index + 1
        return doc

    @staticmethod
    def _find_highest_sort_index(widget_id):
        # find the highest sort order of the engagement
        sort_index = 0
        docs = WidgetDocumentsModel.get_all_by_widget_id(widget_id)
        if docs:
            # Find the largest in the existing widgest
            sort_index = max(doc.sort_index for doc in docs) or 0
        return sort_index

    @staticmethod
    def _validate_parent_type(parent_id):
        parent: WidgetDocumentsModel = WidgetDocumentsModel.find_by_id(parent_id)
        if parent is None:
            raise BusinessException(
                error='Parent Folder doesnt exist.',
                status_code=HTTPStatus.BAD_REQUEST)
        if parent.type == DocumentType.FILE.value:
            raise BusinessException(
                error='Cant nest inside file',
                status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def edit_document(widget_id, document_id, data: dict):
        """Update document from a document widget."""
        updated_document = WidgetDocumentsModel.edit_widget_document(widget_id, document_id, data)
        if not updated_document:
            raise ValueError('Document to update was not found')
        return updated_document

    @staticmethod
    def delete_document(widget_id, document_id):
        """Remove document from a document widget."""
        delete_document = WidgetDocumentsModel.remove_widget_document(widget_id, document_id)
        if not delete_document:
            raise ValueError('Document to remove was not found')
        return delete_document

# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


"""Service for document generation."""
import os

from flask import current_app

from met_api.models.generated_document_template import GeneratedDocumentTemplate
from met_api.services.cdogs_api_service import CdogsApiService
from met_api.utils.enums import GeneratedDocumentTypes


class DocumentGenerationService:  # pylint:disable=too-few-public-methods
    """document generation Service class."""

    def __init__(self):
        """Initiate the class."""
        self.cdgos_api_service = CdogsApiService()

    def generate_document(self, data, options):
        """Generate comment sheet."""
        if not options:
            raise ValueError('Options not provided')

        document_type = options.get('document_type')
        if not document_type:
            raise ValueError('Document type not provided')

        document_template: GeneratedDocumentTemplate = GeneratedDocumentTemplate() \
            .get_template_by_type(type_id=document_type)
        if document_template is None:
            raise ValueError('Template not saved in DB')

        template_cached = False
        if document_template.hash_code:
            current_app.logger.info('Checking if template %s is cached', document_template.hash_code)
            template_cached = self.cdgos_api_service.check_template_cached(document_template.hash_code)

        if document_template.hash_code is None or not template_cached:
            current_app.logger.info('Uploading new template')

            template_name = options.get('template_name')
            file_dir = os.path.dirname(os.path.realpath('__file__'))
            document_template_path = os.path.join(
                file_dir,
                'src/met_api/generated_documents_carbone_templates/',
                template_name
            )

            if not os.path.exists(document_template_path):
                raise ValueError('Template file does not exist')

            new_hash_code = self.cdgos_api_service.upload_template(template_file_path=document_template_path)
            if not new_hash_code:
                raise ValueError('Unable to obtain valid hashcode')
            document_template.hash_code = new_hash_code
            document_template.save()

        generator_options = {
                'cachereport': False,
                'convertTo': options.get('convert_to', 'csv'),
                'overwrite': True,
                'reportName': options.get('report_name', 'report')
        }

        current_app.logger.info('Generating document')
        return self.cdgos_api_service.generate_document(
            template_hash_code=document_template.hash_code,
            data=data,
            options=generator_options
        )

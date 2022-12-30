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


class DocumentGenerationService: # pylint:disable=too-few-public-methods
    """document generation Service class."""

    def __init__(self):
        """Initiate the class."""
        self.cdgos_api_service = CdogsApiService()

    def generate_comment_sheet(self, data):
        """Generate comment sheet."""
        comment_sheet_template: GeneratedDocumentTemplate = GeneratedDocumentTemplate() \
            .get_template_by_type(type_id=GeneratedDocumentTypes.COMMENT_SHEET)
        if comment_sheet_template is None:
            raise ValueError('Template not saved in DB')

        template_cached = False
        if comment_sheet_template.cdogs_hash_code:
            current_app.logger.info('Checking if template %s is cached', comment_sheet_template.cdogs_hash_code)
            template_cached = self.cdgos_api_service.check_template_cached(comment_sheet_template.cdogs_hash_code)

        if comment_sheet_template.cdogs_hash_code is None or not template_cached:
            current_app.logger.info('Uploading new template')

            file_dir = os.path.dirname(os.path.realpath('__file__'))
            comment_sheet_template_path = os.path.join(
                file_dir, 
                'src/met_api/cdogs_templates/staff_comments_sheet.xlsx'
            )
            new_hash_code = self.cdgos_api_service.upload_template(template_file_path=comment_sheet_template_path)
            if not new_hash_code:
                raise ValueError('Unable to obtain valid hashcode')
            comment_sheet_template.cdogs_hash_code = new_hash_code
            comment_sheet_template.save()

        options = {
                'cachereport': False,
                'convertTo' : 'csv',
                'overwrite': True,
                'reportName': 'comments_sheet'
        }

        current_app.logger.info('Generating comment_sheet')
        return self.cdgos_api_service.generate_document(
            template_hash_code=comment_sheet_template.cdogs_hash_code,
            data=data,
            options=options
        )

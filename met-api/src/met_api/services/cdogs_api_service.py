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


"""Service for receipt generation."""
import base64
import json
import os
import re

import requests
from flask import current_app

from met_api.config import _Config


class CdogsApiService:
    """cdogs api Service class."""
    
    def __init__(self):
        self.access_token = self._get_access_token();

    file_dir = os.path.dirname(os.path.realpath('__file__'))

    def generate_document(self, template_hash_code: str, data, options):
        request_body = {
            "options": options,
            "data": data
        }
        json_request_body = json.dumps(request_body)
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.access_token}'
        }
        
        url = f"{_Config.CDOGS_BASE_URL}/api/v2/template/{template_hash_code}/render"
        return self._post_generate_document(json_request_body, headers, url)

    def _post_generate_document(self, json_request_body, headers, url):
        response = requests.post(url, data= json_request_body, headers= headers)
        print(response.content)
        return response

    def upload_template(self, template_file_path):
        
        headers = {
        "Authorization": f'Bearer {self.access_token}'
        }

        url = f"{_Config.CDOGS_BASE_URL}/api/v2/template"
        template = {'template':('template', open(template_file_path, 'rb'), "multipart/form-data")}

        current_app.logger.info('Uploading template %s', template_file_path)
        print('Uploading template %s', template_file_path)
        response = self._post_upload_template(headers, url, template)
        
        if response.status_code == 200:
            if response.headers.get("X-Template-Hash") is None:
                raise ValueError('Data not found')

            current_app.logger.info('Returning new hash %s', response.headers['X-Template-Hash'])
            print('Returning new hash %s', response.headers['X-Template-Hash'])
            return response.headers['X-Template-Hash'];
    
        response_json = json.loads(response.content)
        
        if response.status_code == 405 and response_json['detail'] is not None:
            match = re.findall(r"Hash '(.*?)'", response_json['detail']);
            if match:
                current_app.logger.info('Template already hashed with code %s', match[0])
                print('Template already hashed with code %s', match[0])
                return match[0]

            raise ValueError('Data not found')

    def _post_upload_template(self, headers, url, template):
        response = requests.post(url, headers= headers, files= template)
        return response

    def check_template_cached(self, template_hash_code: str):

        headers = {
        "Authorization": f'Bearer {self.access_token}'
        }

        url = f"{_Config.CDOGS_BASE_URL}/api/v2/template/{template_hash_code}"

        response = requests.get(url, headers= headers)
        return response.status_code == 200

    @staticmethod
    def _get_access_token():
        token_url = _Config.CDOGS_TOKEN_URL
        service_client = _Config.CDOGS_SERVICE_CLIENT
        service_client_secret = _Config.CDOGS_SERVICE_CLIENT_SECRET

        basic_auth_encoded = base64.b64encode(
            bytes(service_client + ':' + service_client_secret, 'utf-8')).decode('utf-8')
        data = 'grant_type=client_credentials'
        response = requests.post(
            token_url,
            data=data,
            headers={
                'Authorization': f'Basic {basic_auth_encoded}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        )

        response_json = response.json()
        return response_json['access_token']
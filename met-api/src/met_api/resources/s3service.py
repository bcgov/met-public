# Copyright © 2021 Province of British Columbia
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
"""API endpoints for managing a FOI Requests resource."""




import json
import requests
import os
import uuid
from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource
from met_api.utils.util import allowedorigins, cors_preflight
from met_api.utils.action_result import ActionResult
from met_api.auth import auth
from aws_requests_auth.aws_auth import AWSRequestsAuth


API = Namespace('engagement', description='Endpoints for Engagements Management')
"""Custom exception messages
"""

@cors_preflight('GET,OPTIONS')
@API.route('/foiflow/oss/authheader')
class FOIFlowDocumentStorage(Resource):
    """Retrieves authentication properties for document storage.
    """
    @staticmethod
    @cross_origin(origins=allowedorigins())
    @auth.require
    def post():
        try:

            formsbucket = os.getenv('OSS_S3_FORMS_BUCKET')
            accesskey = os.getenv('OSS_S3_FORMS_ACCESS_KEY_ID')
            secretkey = os.getenv('OSS_S3_FORMS_SECRET_ACCESS_KEY')
            s3host = os.getenv('OSS_S3_HOST')
            s3region = os.getenv('OSS_S3_REGION')
            s3service = os.getenv('OSS_S3_SERVICE')

            if(accesskey is None or secretkey is None or s3host is None or formsbucket is None):
                return {'status': "Configuration Issue", 'message':"accesskey is None or secretkey is None or S3 host is None or formsbucket is None"}, 500

            requestfilejson = request.get_json()

            for file in requestfilejson:
                foirequestform = FOIRequestsFormsList().load(file)
                ministrycode = foirequestform.get('ministrycode')
                requestnumber = foirequestform.get('requestnumber')
                filestatustransition = foirequestform.get('filestatustransition')
                filename = foirequestform.get('filename')
                s3sourceuri = foirequestform.get('s3sourceuri')
                filenamesplittext = os.path.splitext(filename)
                uniquefilename = '{0}{1}'.format(uuid.uuid4(),filenamesplittext[1])
                auth = AWSRequestsAuth(aws_access_key=accesskey,
                        aws_secret_access_key=secretkey,
                        aws_host=s3host,
                        aws_region=s3region,
                        aws_service=s3service)

                s3uri = s3sourceuri if s3sourceuri is not None else 'https://{0}/{1}/{2}/{3}/{4}/{5}'.format(s3host,formsbucket,ministrycode,requestnumber,filestatustransition,uniquefilename)   
                
                response = requests.put(s3uri,data=None,auth=auth) if s3sourceuri is None  else requests.get(s3uri,auth=auth)


                file['filepath']=s3uri
                file['authheader']=response.request.headers['Authorization']
                file['amzdate']=response.request.headers['x-amz-date']
                file['uniquefilename']=uniquefilename if s3sourceuri is None else ''
                file['filestatustransition']=filestatustransition  if s3sourceuri is None else ''
                
                
            return json.dumps(requestfilejson) , 200
        except KeyError as err:
            return ActionResult.error(str(err))
        except ValueError as err:
            return ActionResult.error(str(err))
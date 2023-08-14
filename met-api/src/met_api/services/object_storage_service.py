
"""Service for object storage management."""
import os
import uuid
from typing import List

import requests
from aws_requests_auth.aws_auth import AWSRequestsAuth
from markupsafe import string

from met_api.config import get_s3_config
from met_api.schemas.document import Document


class ObjectStorageService:
    """Object storage management service."""

    def __init__(self):
        """Initialize the service."""
        # initialize s3 config from environment variables
        self.s3_access_key_id = get_s3_config('S3_ACCESS_KEY_ID')
        self.s3_secret_access_key = get_s3_config('S3_SECRET_ACCESS_KEY')
        self.s3_host = get_s3_config('S3_HOST')
        self.s3_bucket = get_s3_config('S3_BUCKET')
        self.s3_region = get_s3_config('S3_REGION')
        self.s3_service = get_s3_config('S3_SERVICE')

    def get_url(self, filename: string):
        """Get the object url."""
        if(not self.s3_host or
            not self.s3_bucket or
            not filename
           ):
            return ''

        return f'https://{self.s3_host}/{self.s3_bucket}/{filename}'

    def get_auth_headers(self, documents: List[Document]):
        """Get the s3 auth headers or the provided documents."""
        if(self.s3_access_key_id is None or
            self.s3_secret_access_key is None or
            self.s3_host is None or
            self.s3_bucket is None
           ):
            return {'status': 'Configuration Issue',
                    'message': 'accesskey is None or secretkey is None or S3 host is None or formsbucket is None'}, 500

        for file in documents:
            s3sourceuri = file.get('s3sourceuri', None)
            filenamesplittext = os.path.splitext(file.get('filename'))
            uniquefilename = f'{uuid.uuid4()}{filenamesplittext[1]}'
            auth = AWSRequestsAuth(
                    aws_access_key=self.s3_access_key_id,
                    aws_secret_access_key=self.s3_secret_access_key,
                    aws_host=self.s3_host,
                    aws_region=self.s3_region,
                    aws_service=self.s3_service)

            s3uri = s3sourceuri if s3sourceuri is not None else self.get_url(uniquefilename)
            response = requests.put(
                s3uri, data=None, auth=auth) if s3sourceuri is None else requests.get(s3uri, auth=auth)

            file['filepath'] = s3uri
            file['authheader'] = response.request.headers['Authorization']
            file['amzdate'] = response.request.headers['x-amz-date']
            file['uniquefilename'] = uniquefilename if s3sourceuri is None else ''
        return documents

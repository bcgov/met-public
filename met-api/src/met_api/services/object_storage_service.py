
"""Service for object storage management."""
import os
import uuid
from typing import List
import requests
from markupsafe import string
from aws_requests_auth.aws_auth import AWSRequestsAuth
from met_api.config import _Config
from met_api.schemas.document import Document


class ObjectStorageService:
    """Object storage management service."""

    @staticmethod
    def get_url(filename: string):
        """Get the object url."""
        return f'https://{_Config.OSS_S3_HOST}/{_Config.OSS_S3_BUCKET}/{filename}' if filename is not None else ''

    def get_auth_headers(self, documents: List[Document]):
        """Get the s3 auth headers or the provided documents."""
        if(_Config.OSS_S3_ACCESS_KEY_ID is None or
            _Config.OSS_S3_SECRET_ACCESS_KEY is None or
            _Config.OSS_S3_HOST is None or
            _Config.OSS_S3_BUCKET is None
           ):
            return {'status': 'Configuration Issue',
                    'message': 'accesskey is None or secretkey is None or S3 host is None or formsbucket is None'}, 500

        for file in documents:
            s3sourceuri = file.get('s3sourceuri', None)
            filenamesplittext = os.path.splitext(file.get('filename'))
            uniquefilename = f'{uuid.uuid4()}{filenamesplittext[1]}'
            auth = AWSRequestsAuth(
                    aws_access_key=_Config.OSS_S3_ACCESS_KEY_ID,
                    aws_secret_access_key=_Config.OSS_S3_SECRET_ACCESS_KEY,
                    aws_host=_Config.OSS_S3_HOST,
                    aws_region=_Config.OSS_S3_REGION,
                    aws_service=_Config.OSS_S3_SERVICE)

            s3uri = s3sourceuri if s3sourceuri is not None else self.get_url(uniquefilename)
            response = requests.put(
                s3uri, data=None, auth=auth) if s3sourceuri is None else requests.get(s3uri, auth=auth)

            file['filepath'] = s3uri
            file['authheader'] = response.request.headers['Authorization']
            file['amzdate'] = response.request.headers['x-amz-date']
            file['uniquefilename'] = uniquefilename if s3sourceuri is None else ''
        return documents

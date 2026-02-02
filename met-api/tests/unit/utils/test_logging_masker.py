# Copyright © 2021 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for logging masker utilities."""

import logging

from met_api.utils.logging_masker import (
    SensitiveDataFilter,
    mask_dict,
    mask_url,
)


def test_logging_masker():
    """Test comprehensive logging masker functionality for sensitive data."""
    # Test URL masking
    url = 'postgresql://user:secretpassword@localhost:5432/metdb'
    masked_url = mask_url(url)
    assert 'secretpassword' not in masked_url
    assert '***REDACTED***' in masked_url
    assert 'user' in masked_url
    
    # Test dictionary masking with various sensitive keys
    data = {
        'username': 'admin',
        'password': 'secret123',
        'api_key': 'myapikey',
        'token': 'mytoken',
        'email': 'test@example.com',
        'config': {
            'secret': 'nested_secret'
        }
    }
    masked_data = mask_dict(data)
    assert masked_data['password'] == '***REDACTED***'
    assert masked_data['api_key'] == '***REDACTED***'
    assert masked_data['token'] == '***REDACTED***'
    assert masked_data['config']['secret'] == '***REDACTED***'
    assert masked_data['username'] == 'admin'
    assert masked_data['email'] == 'test@example.com'
    
    # Test SensitiveDataFilter with various patterns
    filter_obj = SensitiveDataFilter()
    
    # Test SQLAlchemy URL
    log_record = logging.LogRecord(
        name='test', level=logging.INFO, pathname='', lineno=0,
        msg='SQLAlchemy URL: postgresql://dbuser:complexP@ss123@localhost:5432/metdb',
        args=(), exc_info=None
    )
    filter_obj.filter(log_record)
    assert 'complexP@ss123' not in str(log_record.msg)
    assert '***REDACTED***' in str(log_record.msg)
    
    # Test JWT token
    jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.abc123'
    log_record = logging.LogRecord(
        name='test', level=logging.INFO, pathname='', lineno=0,
        msg=f'Processing token: {jwt_token}',
        args=(), exc_info=None
    )
    filter_obj.filter(log_record)
    assert jwt_token not in str(log_record.msg)
    assert '***REDACTED_JWT***' in str(log_record.msg)
    
    # Test normal content preservation
    normal_message = 'Processing user request for engagement ID 123'
    log_record = logging.LogRecord(
        name='test', level=logging.INFO, pathname='', lineno=0,
        msg=normal_message, args=(), exc_info=None
    )
    filter_obj.filter(log_record)
    assert log_record.msg == normal_message

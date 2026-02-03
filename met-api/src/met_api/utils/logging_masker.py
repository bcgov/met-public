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

"""
Logging masker utility for sensitive data.

This module provides utilities to mask sensitive information in logs,
including passwords, tokens, API keys, and other credentials.

USAGE:
    Automatic masking is enabled app-wide via logging configuration.
    No code changes needed for existing logging statements.
    
    For explicit masking:
        from met_api.utils.logging_masker import mask_url, mask_dict
        
        # Mask URLs
        safe_url = mask_url(database_url)
        
        # Mask dictionaries
        safe_headers = mask_dict(request.headers)

WHAT GETS MASKED:
    - Database connection strings (PostgreSQL, MySQL, MongoDB, Redis)
    - Authentication tokens (Bearer, JWT)
    - API keys and AWS credentials
    - Passwords and secrets
    - Private keys in PEM format

ADDING NEW PATTERNS:
    Add to SensitiveDataFilter.DEFAULT_PATTERNS list with:
    - 'pattern': compiled regex pattern
    - 'replacement': replacement string with capture groups
    - 'description': human-readable description
"""

import logging
import re
from typing import Any, Dict, List, Pattern


class SensitiveDataFilter(logging.Filter):
    """
    Logging filter that masks sensitive data in log messages.

    This filter uses regex patterns to identify and mask sensitive information
    such as passwords, tokens, API keys, and other credentials before they
    are written to logs.
    """

    # Mask string to replace sensitive data
    MASK = '***REDACTED***'
    DEFAULT_REPLACEMENT = r'\1' + MASK + r'\3'

    # Regex patterns for common sensitive data
    DEFAULT_PATTERNS: List[Dict[str, Any]] = [
        # Database connection strings (postgresql, mysql, etc.)
        {
            'pattern': re.compile(
                r'(postgresql|mysql|mongodb|redis)://[^:]+:([^@]+)@',
                re.IGNORECASE
            ),
            'replacement': r'\1://***REDACTED***:***REDACTED***@',
            'description': 'Database connection string with credentials'
        },
        # Bearer tokens in Authorization headers
        {
            'pattern': re.compile(
                r'(Authorization:\s*Bearer\s+)([A-Z0-9\-_\.]+)',
                re.IGNORECASE
            ),
            'replacement': r'\1***REDACTED***',
            'description': 'Bearer token in Authorization header'
        },
        # Generic Authorization header values
        {
            'pattern': re.compile(
                r"('Authorization':\s*')([^']+)(')",
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'Authorization header value'
        },
        # API keys (various formats)
        {
            'pattern': re.compile(
                r'(api[_-]?key\s*[:=]\s*["\']?)([A-Z0-9_\-]{20,})(["\']?)',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'API key'
        },
        # AWS/S3 access keys
        {
            'pattern': re.compile(
                r'(access[_-]?key[_-]?id\s*[:=]\s*["\']?)([A-Z0-9]{20})(["\']?)',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'AWS access key'
        },
        # AWS/S3 secret keys
        {
            'pattern': re.compile(
                r'(secret[_-]?access[_-]?key\s*[:=]\s*["\']?)([A-Z0-9/+=]{40})(["\']?)',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'AWS secret key'
        },
        # Generic secret/password patterns
        {
            'pattern': re.compile(
                r'(password\s*[:=]\s*["\']?)([^"\'\s,}]{3,})(["\'\s,}])',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'Password field (key=value format)'
        },
        {
            'pattern': re.compile(
                r'(\bwith\s+password\s*:\s*)([^\s,}]+)',
                re.IGNORECASE
            ),
            'replacement': r'\1***REDACTED***',
            'description': 'Password in sentence'
        },
        {
            'pattern': re.compile(
                r'(secret\s*[:=]\s*["\']?)([^"\'\s,}]{3,})(["\'\s,}])',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'Secret field'
        },
        # JWT tokens (three base64url segments separated by dots)
        {
            'pattern': re.compile(
                r'\b(eyJ[A-Z0-9_-]+\.eyJ[A-Z0-9_-]+\.[A-Z0-9_-]+)\b'
            ),
            'replacement': r'***REDACTED_JWT***',
            'description': 'JWT token'
        },
        # Generic tokens (token=value or "token": "value")
        {
            'pattern': re.compile(
                r'(token["\']?\s*[:=]\s*["\']?)([A-Z0-9_\-\.]{20,})(["\']?)',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'Generic token'
        },
        # Client secrets
        {
            'pattern': re.compile(
                r'(client[_-]?secret\s*[:=]\s*["\']?)([^"\'\s,}]{10,})(["\'\s,}])',
                re.IGNORECASE
            ),
            'replacement': SensitiveDataFilter.DEFAULT_REPLACEMENT,
            'description': 'Client secret'
        },
        # Private keys (PEM format)
        {
            'pattern': re.compile(
                r'-----BEGIN[A-Z\s]+PRIVATE KEY-----[A-Za-z0-9+/=\s]+-----END[A-Z\s]+PRIVATE KEY-----',
                re.MULTILINE
            ),
            'replacement': r'***REDACTED_PRIVATE_KEY***',
            'description': 'Private key in PEM format'
        },
    ]

    def __init__(self, name: str = '', custom_patterns: List[Dict[str, Any]] = None):
        """
        Initialize the filter.

        Args:
            name: Name of the filter
            custom_patterns: Optional custom patterns to use instead of defaults
        """
        super().__init__(name)
        self.patterns = custom_patterns if custom_patterns is not None else self.DEFAULT_PATTERNS

    def filter(self, record: logging.LogRecord) -> bool:
        """
        Filter log record to mask sensitive data.

        Args:
            record: The log record to filter

        Returns:
            True (always allows the record through after masking)
        """
        # Mask the message
        record.msg = self.mask_sensitive_data(str(record.msg))

        # Mask args if present
        if record.args:
            if isinstance(record.args, dict):
                record.args = {
                    k: self.mask_sensitive_data(str(v))
                    for k, v in record.args.items()
                }
            elif isinstance(record.args, tuple):
                record.args = tuple(
                    self.mask_sensitive_data(str(arg))
                    for arg in record.args
                )

        return True

    def mask_sensitive_data(self, text: str) -> str:
        """
        Mask sensitive data in a string using defined patterns.

        Args:
            text: The text to mask

        Returns:
            The text with sensitive data masked
        """
        if not text or not isinstance(text, str):
            return text

        masked_text = text
        for pattern_config in self.patterns:
            pattern: Pattern = pattern_config['pattern']
            replacement: str = pattern_config['replacement']
            masked_text = pattern.sub(replacement, masked_text)

        return masked_text


def mask_dict(data: Dict[str, Any], sensitive_keys: List[str] = None) -> Dict[str, Any]:
    """
    Mask sensitive keys in a dictionary.

    Args:
        data: Dictionary to mask
        sensitive_keys: List of keys to mask (case-insensitive)

    Returns:
        Dictionary with sensitive values masked
    """
    if sensitive_keys is None:
        sensitive_keys = [
            'password', 'secret', 'token', 'api_key', 'apikey',
            'access_key', 'secret_key', 'client_secret',
            'authorization', 'auth', 'credentials'
        ]

    if not isinstance(data, dict):
        return data

    masked_data = {}
    for key, value in data.items():
        # Check if key contains sensitive keywords
        if any(sensitive in key.lower() for sensitive in sensitive_keys):
            masked_data[key] = '***REDACTED***'
        elif isinstance(value, dict):
            masked_data[key] = mask_dict(value, sensitive_keys)
        elif isinstance(value, list):
            masked_data[key] = [
                mask_dict(item, sensitive_keys) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            masked_data[key] = value

    return masked_data


def mask_url(url: str) -> str:
    """
    Mask credentials in a URL.

    Args:
        url: URL string that may contain credentials

    Returns:
        URL with credentials masked
    """
    # Pattern to match URLs with credentials
    pattern = re.compile(
        r'((?:https?|ftp|postgresql|mysql|mongodb|redis)://)'
        r'([^:]+):([^@]+)@'
        r'(.+)',
        re.IGNORECASE
    )

    match = pattern.match(url)
    if match:
        protocol, _username, _password, rest = match.groups()
        return f'{protocol}***REDACTED***:***REDACTED***@{rest}'

    return url


def setup_logging_masking(logger: logging.Logger = None) -> None:
    """
    Set up sensitive data masking for a logger.

    If no logger is provided, sets up masking for the root logger.

    Args:
        logger: Logger to add the filter to (defaults to root logger)
    """
    if logger is None:
        logger = logging.getLogger()

    # Add the filter if not already present
    if not any(isinstance(f, SensitiveDataFilter) for f in logger.filters):
        logger.addFilter(SensitiveDataFilter())


def get_masked_config_string(config_obj: Any) -> str:
    """
    Get a string representation of a config object with sensitive data masked.

    Args:
        config_obj: Configuration object to stringify

    Returns:
        Masked string representation of the config
    """
    config_dict = {}
    for attr in dir(config_obj):
        if not attr.startswith('_'):
            value = getattr(config_obj, attr, None)
            if not callable(value):
                config_dict[attr] = value

    masked_dict = mask_dict(config_dict)
    return str(masked_dict)

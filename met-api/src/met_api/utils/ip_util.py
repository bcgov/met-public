"""
This module provides utility functions for handling IP addresses in a Flask application.

It includes a function for hashing IP addresses using SHA256, ensuring secure and consistent
hashing by combining each IP address with the Flask application's secret key. This approach
is typically used for anonymizing IP addresses while maintaining the ability to identify
sessions or users without storing their actual IP addresses.

Functions:
    hash_ip(ip_address): Hashes an IP address with the Flask secret key.
"""
from hashlib import sha256
from flask import current_app


def hash_ip(ip_address):
    """
    Hashes the given IP address concatenated with the Flask secret key.

    Args:
    ip_address (str): The IP address to be hashed.

    Returns:
    str: The resulting SHA256 hash as a hexadecimal string.
    """
    # Retrieve the secret key from Flask configuration with a fallback empty string
    secret_key = current_app.config.get('SECRET_KEY', '')

    # Extract the fragment (e.g., first three octets of an IPv4 address)
    ip_fragment = '.'.join(ip_address.split('.')[:3])

    # Concatenate the IP address and secret key, and hash the resulting string
    return sha256(f'{ip_fragment}{secret_key}'.encode()).hexdigest()

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

    # Concatenate the IP address and secret key, and hash the resulting string
    return sha256(f"{ip_address}{secret_key}".encode()).hexdigest()

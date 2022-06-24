"""Helper for token decoding."""
from flask import g


class TokenInfo:
    """Token info."""

    @staticmethod
    def get_id():
        """Get the user identifier."""
        token_info = g.token_info
        return token_info.get('sub', None)

    @staticmethod
    def get_user_data():
        """Get the user data."""
        token_info = g.token_info
        user_data = {
            'external_id': token_info.get('sub', None),
            'first_name': token_info.get('given_name', None),
            'last_name': token_info.get('family_name', None),
            'email_id': token_info.get('email', None)
        }
        return user_data

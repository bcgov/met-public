"""Helper for token decoding."""
from flask import current_app, g

from met_api.utils.roles import Role


class TokenInfo:
    """Token info."""

    @staticmethod
    def get_id():
        """Get the user identifier."""
        try:
            token_info = g.token_info
            return token_info.get('sub', None)
        except AttributeError:
            return None

    @staticmethod
    def get_user_data():
        """Get the user data."""
        token_info = g.token_info
        user_data = {
            'external_id': token_info.get('sub', None),
            'first_name': token_info.get('given_name', None),
            'last_name': token_info.get('family_name', None),
            'email_id': token_info.get('email', None),
            'username': token_info.get('preferred_username', None),
            'identity_provider': token_info.get('identity_provider', ''),
            'roles': TokenInfo.get_user_roles(),
        }
        return user_data
    
    def get_user_roles():
        valid_roles = set(item.value for item in Role) 
        token_roles = current_app.config['JWT_ROLE_CALLBACK'](g.token_info);
        return valid_roles.intersection(token_roles)

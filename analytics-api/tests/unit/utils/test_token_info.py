from faker import Faker
from unittest.mock import patch
from analytics_api.utils.token_info import TokenInfo
from unittest.mock import MagicMock

fake = Faker()


def test_get_id_without_user_context():
    # Call the get_id method without user context
    user_id = TokenInfo.get_id()

    # Assert that the user ID is None
    assert user_id is None


def test_get_user_data(session):  # pylint:disable=unused-argument
    # Mock the token_info object stored in g.jwt_oidc_token_info
    sub = fake.name()
    token_info = {
        'sub': sub,
        'given_name': fake.name(),
        'family_name': fake.name(),
        'email': fake.email(),
        'preferred_username': fake.name(),
        'identity_provider': fake.word()
    }
    g = MagicMock()
    g.jwt_oidc_token_info = token_info

    # Patch the 'g' object in the module where TokenInfo is defined
    with patch('analytics_api.utils.token_info.g', g):
        # Call the get_user_data method
        user_data = TokenInfo.get_user_data()

        # Assert that the returned user_data matches the expected values
        assert user_data['external_id'] == sub

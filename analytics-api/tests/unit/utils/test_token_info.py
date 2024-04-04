from faker import Faker
from analytics_api.utils.token_info import TokenInfo

fake = Faker()


def test_get_id_without_user_context():
    # Call the get_id method without user context
    user_id = TokenInfo.get_id()

    # Assert that the user ID is None
    assert user_id is None

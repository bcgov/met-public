"""An object to return db operation result."""


class DefaultMethodResult:  # pylint: disable=too-few-public-methods
    """Default method result."""

    success = False
    message = ''
    identifier = ''

    def __init__(self, success, message, identifier, *args):
        """Init the class."""
        self.success = success
        self.message = message
        self.identifier = identifier
        self.args = args

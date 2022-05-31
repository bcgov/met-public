"""An object to return db operation result.
"""


# models\defaultMethodResult.py
class DefaultMethodResult:  # pylint: disable=too-few-public-methods
    success = False
    message = ''
    identifier = ''

    def __init__(self, success, message, identifier, *args):
        self.success = success
        self.message = message
        self.identifier = identifier
        self.args = args

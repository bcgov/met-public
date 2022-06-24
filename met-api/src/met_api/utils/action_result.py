
"""Helper for resource responses."""


class ActionResult:
    """API Resource Response."""

    @staticmethod
    def success(id=None, result=None):
        """Return a success response."""
        return {'status': True, 'message': '', 'id': id, 'result': result}, 200

    @staticmethod
    def error(message):
        """Return an error response."""
        return {'status': False, 'message': message}, 500

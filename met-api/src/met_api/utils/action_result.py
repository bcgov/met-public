
"""Helper for resource responses."""


class ActionResult:
    """API Resource Response."""

    @staticmethod
    def success(id = None, result = None):
        return {'status': True, 'message': '', 'id': id, 'result': result}, 200

    @staticmethod
    def error(message):
        return {'status': False, 'message': message}, 500

"""Pylint plugin to check for print statements.

Print statements bypass logging masking and pose a security risk by potentially
exposing sensitive data (passwords, tokens, API keys, etc.) in logs.

Use current_app.logger or logging.getLogger(__name__) instead.
"""

from astroid import nodes
from pylint.checkers import BaseChecker


class NoPrintChecker(BaseChecker):
    """Check for print statements which bypass logging masking."""

    name = "no-print"
    msgs = {
        "W9001": (
            "Print statement found - use logging to ensure sensitive data masking",
            "print-statement-found",
            "Print statements bypass the logging masking system and may expose "
            "sensitive data (passwords, tokens, API keys). Use current_app.logger "
            "or logging.getLogger(__name__) instead.",
        ),
    }

    def visit_call(self, node: nodes.Call) -> None:
        """Check if the node is a print function call."""
        if isinstance(node.func, nodes.Name) and node.func.name == "print":
            # Allow print in config.py for startup messages before logging is initialized
            if node.root().file and "config.py" in node.root().file:
                return
            self.add_message("print-statement-found", node=node)


def register(linter):
    """Register the checker."""
    linter.register_checker(NoPrintChecker(linter))

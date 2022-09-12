"""This module holds data classes."""

from attr import dataclass

@dataclass
class PaginationOptions:  # pylint: disable=too-many-instance-attributes
    """Used for searching organizations."""

    page: int
    size: int
    sort_key: int
    sort_order: str
"""This module holds data classes."""

from attr import dataclass


@dataclass
class PaginationOptions:  # pylint: disable=too-many-instance-attributes
    """Used to store pagination options."""

    page: int
    size: int
    sort_key: int
    sort_order: str

"""Constants of timeline events."""
from enum import IntEnum


class TimelineEventStatus(IntEnum):
    """Enum of timeline event status status."""

    Pending = 1
    InProgress = 2
    Completed = 3

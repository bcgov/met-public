"""Service for Widget Timeline management."""
from met_api.constants.membership_type import MembershipType
from met_api.models.widget_timeline import TimelineEvent as TimelineEventModel
from met_api.services import authorization
from met_api.utils.roles import Role


class TimelineEventService:
    """Timeline event management service."""

    @staticmethod
    def get_timeline_event(timeline_event_id):
        """Get timeline event by timeline event id."""
        timeline_event = TimelineEventModel.find_by_id(timeline_event_id)
        return timeline_event

    @staticmethod
    def create_timeline_event(timeline_id, event_details: dict):
        """Create timeline event for a timeline."""
        event_data = dict(event_details)
        eng_id = event_data.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        timeline_event = TimelineEventService._create_timeline_event_model(timeline_id, event_data)
        timeline_event.commit()
        return timeline_event

    @staticmethod
    def update_timeline_event(timeline_id, event_id, event_data):
        """Update timeline event."""
        timeline_event: TimelineEventModel = TimelineEventModel.find_by_id(event_id)
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=timeline_event.engagement_id)

        if not timeline_event:
            raise KeyError('Event not found')

        if timeline_event.timeline_id != timeline_id:
            raise ValueError('Invalid timeline and event')

        return TimelineEventModel.update_timeline_event(timeline_event.id, event_data)

    @staticmethod
    def _create_timeline_event_model(timeline_id, event_data: dict):
        timeline_event_model: TimelineEventModel = TimelineEventModel()
        timeline_event_model.widget_id = event_data.get('widget_id')
        timeline_event_model.engagement_id = event_data.get('engagement_id')
        timeline_event_model.timeline_id = timeline_id
        timeline_event_model.status = event_data.get('status')
        timeline_event_model.position = event_data.get('position')
        timeline_event_model.description = event_data.get('description')
        timeline_event_model.time = event_data.get('time')
        timeline_event_model.flush()
        return timeline_event_model

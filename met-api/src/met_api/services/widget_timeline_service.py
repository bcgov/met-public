"""Service for Widget Timeline management."""
from met_api.constants.membership_type import MembershipType
from met_api.models.widget_timeline import WidgetTimeline as WidgetTimelineModel
from met_api.models.timeline_event import TimelineEvent as TimelineEventModel
from met_api.services import authorization
from met_api.utils.roles import Role


class WidgetTimelineService:
    """Widget Timeline management service."""

    @staticmethod
    def get_timeline(widget_id):
        """Get timeline by widget id."""
        widget_timeline = WidgetTimelineModel.get_timeline(widget_id)
        return widget_timeline

    @staticmethod
    def create_timeline(widget_id, timeline_details):
        """Create timeline for the widget."""
        timeline_data = dict(timeline_details)
        eng_id = timeline_data.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        widget_timeline = WidgetTimelineService._create_timeline_model(widget_id, timeline_data)
        widget_timeline.commit()
        return widget_timeline

    @staticmethod
    def update_timeline(widget_id, timeline_id, timeline_data):
        """Update timeline widget."""
        events = timeline_data.get("events")
        first_event = events[0]
        widget_timeline: WidgetTimelineModel = WidgetTimelineModel.find_by_id(timeline_id)
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=first_event.get('engagement_id'))
        if not widget_timeline:
            raise KeyError('Timeline widget not found')

        if widget_timeline.widget_id != widget_id:
            raise ValueError('Invalid widget ID')

        if widget_timeline.id != timeline_id:
            raise ValueError('Invalid timeline ID')

        return WidgetTimelineModel.update_timeline(timeline_id, timeline_data)

    @staticmethod
    def _create_timeline_model(widget_id, timeline_data: dict):
        timeline_model: WidgetTimelineModel = WidgetTimelineModel()
        timeline_model.widget_id = widget_id
        timeline_model.engagement_id = timeline_data.get('engagement_id')
        timeline_model.title = timeline_data.get('title')
        timeline_model.description = timeline_data.get('description')
        for event in timeline_data.get('events', []):
            timeline_model.events.append(
                TimelineEventModel(
                    widget_id = widget_id,
                    engagement_id = event.get('engagement_id'),
                    timeline_id = event.get('timeline_id'),
                    description = event.get('description'),
                    time = event.get('time'),
                    position = event.get('position'),
                    status = event.get('status'),
                )
            )
        timeline_model.flush()
        return timeline_model

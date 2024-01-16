"""Service for Widget Timeline management."""
from http import HTTPStatus
from typing import Optional

from met_api.constants.membership_type import MembershipType
from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget_timeline import WidgetTimeline as WidgetTimelineModel
from met_api.models.timeline_event import TimelineEvent as TimelineEventModel
from met_api.services import authorization
from met_api.services.timeline_event_service import TimelineEventService
from met_api.utils.roles import Role


class WidgetTimelineService:
    """Widget Timeline management service."""

    @staticmethod
    def get_timeline(widget_id: int):
        """Get timeline by widget id."""
        widget_timeline = WidgetTimelineModel.get_timeline(widget_id)
        return widget_timeline

    @staticmethod
    def create_timeline(widget_id: int, timeline_details: dict):
        """Create timeline for the widget."""
        timeline_data = dict(timeline_details)
        eng_id = timeline_data.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

        widget_timeline = WidgetTimelineService._create_timeline_model(widget_id, timeline_data)
        widget_timeline.commit()
        return widget_timeline

    @staticmethod
    def update_timeline(widget_id: int, timeline_id: int, timeline_data: dict) -> Optional[WidgetTimelineModel]:
        """Update timeline widget."""
        events = timeline_data.get('events')
        first_event = events[0]

        WidgetTimelineService._check_update_timeline_auth(first_event)

        widget_timeline: WidgetTimelineModel = WidgetTimelineModel.find_by_id(timeline_id)

        if not widget_timeline:
            raise BusinessException(
                error='Timeline widget not found',
                status_code=HTTPStatus.BAD_REQUEST)

        if widget_timeline.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widget ID',
                status_code=HTTPStatus.BAD_REQUEST)

        if widget_timeline.id != timeline_id:
            raise BusinessException(
                error='Invalid timeline ID',
                status_code=HTTPStatus.BAD_REQUEST)

        WidgetTimelineService._update_widget_timeline(widget_timeline, timeline_data)

        return widget_timeline

    @staticmethod
    def _check_update_timeline_auth(first_event):
        eng_id = first_event.get('engagement_id')
        authorization.check_auth(one_of_roles=(MembershipType.TEAM_MEMBER.name,
                                               Role.EDIT_ENGAGEMENT.value), engagement_id=eng_id)

    @staticmethod
    def _update_widget_timeline(widget_timeline: WidgetTimelineModel, timeline_data: dict):
        widget_timeline.title = timeline_data.get('title')
        widget_timeline.description = timeline_data.get('description')
        TimelineEventModel.delete_event(widget_timeline.id)
        for event in timeline_data.get('events', []):
            TimelineEventService.create_timeline_event(widget_timeline.id, event)
        widget_timeline.save()

    @staticmethod
    def _create_timeline_model(widget_id: int, timeline_data: dict):
        timeline_model: WidgetTimelineModel = WidgetTimelineModel()
        timeline_model.widget_id = widget_id
        timeline_model.engagement_id = timeline_data.get('engagement_id')
        timeline_model.title = timeline_data.get('title')
        timeline_model.description = timeline_data.get('description')
        for event in timeline_data.get('events', []):
            timeline_model.events.append(
                TimelineEventModel(
                    widget_id=widget_id,
                    engagement_id=event.get('engagement_id'),
                    timeline_id=event.get('timeline_id'),
                    description=event.get('description'),
                    time=event.get('time'),
                    position=event.get('position'),
                    status=event.get('status'),
                )
            )
        timeline_model.flush()
        return timeline_model

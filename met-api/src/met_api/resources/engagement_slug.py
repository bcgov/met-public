from http import HTTPStatus

from flask import request
from flask_cors import cross_origin
from flask_restx import Namespace, Resource

from met_api.auth import auth
from met_api.exceptions.business_exception import BusinessException
from met_api.services.engagement_slug import EngagementSlugService

API = Namespace('engagementslugs', description='Endpoints for Engagement Slug Management')


@API.route('/<slug>')
class EngagementSlug(Resource):
    """Resource for managing an engagement slug."""

    @staticmethod
    @cross_origin()
    def get(slug):
        """Fetch an engagement slug matching the provided slug."""
        try:
            engagement_slug = EngagementSlugService.get_engagement_slug(slug)
            return engagement_slug.to_dict(), HTTPStatus.OK
        except BusinessException as e:
            return {'error': str(e)}, HTTPStatus.NOT_FOUND

    @staticmethod
    @cross_origin()
    @auth.require
    def post(slug):
        """Create a new engagement slug."""
        try:
            engagement_id = request.json.get('engagement_id')
            engagement_slug = EngagementSlugService.create_engagement_slug(engagement_id, slug)
            return engagement_slug.to_dict(), HTTPStatus.CREATED
        except BusinessException as e:
            return {'error': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    @staticmethod
    @cross_origin()
    @auth.require
    def patch(slug):
        """Update an existing engagement slug."""
        try:
            engagement_id = request.json.get('engagement_id')
            engagement_slug = EngagementSlugService.update_engagement_slug(slug, engagement_id)
            return engagement_slug.to_dict(), HTTPStatus.OK
        except BusinessException as e:
            return {'error': str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

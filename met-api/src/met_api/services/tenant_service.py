"""Service for tenant."""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from met_api.models.tenant import Tenant as TenantModel
from ..utils.cache import cache


class TenantService:  # pylint: disable=too-few-public-methods
    """Tenant management service."""

    @classmethod
    def build_all_tenant_cache(cls):
        """Build cache for all tenant values."""
        try:
            tenants = TenantModel.query.all()
            for tenant in tenants:
                key = tenant.short_name.upper()
                cache.set(f'tenant_{key}', tenant)
        except SQLAlchemyError as e:
            current_app.logger.info('Error on building cache {}', e)

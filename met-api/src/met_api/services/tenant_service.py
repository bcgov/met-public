"""Service for tenant."""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from met_api.models.tenant import Tenant as TenantModel
from met_api.schemas.tenant import TenantSchema
from ..utils.cache import cache


class TenantService:
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

    @classmethod
    def get(cls, tenant_id):
        """Get a tenant by id."""
        tenant = TenantModel.find_by_short_name(tenant_id)
        if not tenant:
            raise ValueError('Tenant not found.', cls, tenant_id)
        return TenantSchema().dump(tenant)

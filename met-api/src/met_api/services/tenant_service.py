"""Service for tenant."""

from flask import current_app
from sqlalchemy.exc import SQLAlchemyError

from met_api.models.tenant import Tenant as TenantModel
from met_api.schemas.tenant import TenantSchema
from met_api.services import authorization
from met_api.utils.roles import Role
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

    def get_all(self):
        """Get all tenants."""
        tenants = TenantModel.query.all()
        return TenantSchema().dump(tenants, many=True)
    
    @classmethod
    def create(cls, data: dict):
        """Create a new tenant."""
        one_of_roles = (
            Role.SUPER_ADMIN.value,
        )
        authorization.check_auth(one_of_roles=one_of_roles)
        tenant = TenantModel(**data)
        try:
            tenant.save()
        except SQLAlchemyError as e:
            current_app.logger.error('Error creating tenant {}', e)
            raise ValueError('Error creating tenant.') from e
        return TenantSchema().dump(tenant)

    @classmethod
    def update(cls, tenant_id: int, data: dict):
        """Update an existing tenant."""
        one_of_roles = (
            Role.SUPER_ADMIN.value,
        )
        authorization.check_auth(one_of_roles=one_of_roles)
        tenant = TenantModel.find_by_id(tenant_id)
        if not tenant:
            raise ValueError('Tenant not found.', cls, tenant_id)
        try:
            tenant.update(data)
        except SQLAlchemyError as e:
            current_app.logger.error('Error updating tenant {}', e)
            raise ValueError('Error updating tenant.') from e
        return TenantSchema().dump(tenant)

    @classmethod
    def delete(cls, tenant_id: int):
        """Delete an existing tenant."""
        one_of_roles = (
            Role.SUPER_ADMIN.value,
        )
        authorization.check_auth(one_of_roles=one_of_roles)
        tenant = TenantModel.find_by_id(tenant_id)
        if not tenant:
            raise ValueError('Tenant not found.', cls, tenant_id)
        try:
            tenant.delete()
        except SQLAlchemyError as e:
            current_app.logger.error('Error deleting tenant {}', e)
            raise ValueError('Error deleting tenant.') from e
        return {'status': 'success', 'message': 'Tenant deleted successfully'}
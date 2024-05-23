"""Unit tests for the tenant service."""
import pytest
from unittest.mock import patch
from sqlalchemy.exc import SQLAlchemyError

from met_api.models.tenant import Tenant as TenantModel
from met_api.schemas.tenant import TenantSchema
from met_api.services import authorization
from met_api.services.tenant_service import TenantService
from tests.utilities.factory_utils import factory_tenant_model, TestTenantInfo


def test_get_tenant(session):
    """Test getting a tenant by id."""
    tenant = factory_tenant_model()
    with patch.object(TenantModel, 'find_by_short_name', return_value=tenant):
        result = TenantService.get('GDX')
        assert result['short_name'] == tenant.short_name
        assert result['name'] == tenant.name


def test_get_all_tenants(session):
    """Test getting all tenants."""
    tenant = factory_tenant_model()
    tenant2 = factory_tenant_model({**TestTenantInfo.tenant1, 'short_name': 'GDX2'})
    result = TenantService.get_all()
    tenant_short_names = [tenant.get('short_name') for tenant in result]
    assert tenant.short_name in tenant_short_names
    assert tenant2.short_name in tenant_short_names


def test_get_tenant_not_found(session):
    """Test getting a tenant by id that does not exist."""
    with patch.object(TenantModel, 'find_by_short_name', return_value=None):
        with pytest.raises(ValueError):
            TenantService.get('NONEXISTENT')


def test_create_tenant(session):
    """Test creating a tenant."""
    with patch.object(authorization, 'check_auth', return_value=True):
        tenant_data = {
            'short_name': 'GDX',
            'name': 'Government Digital Experience',
            'contact_name': 'John Doe',
            'contact_email': 'john.doe@gov.bc.ca',
            'title': 'Director'
        }
        with patch.object(TenantModel, 'save', return_value=None):
            with patch.object(TenantSchema, 'dump', return_value=tenant_data):
                result = TenantService.create(tenant_data)
                assert result['short_name'] == tenant_data['short_name']
                assert result['name'] == tenant_data['name']


def test_create_tenant_error(session):
    """Test creating a tenant with an error."""
    tenant_data = {
        'short_name': 'GDX',
        'name': 'Government Digital Experience'
    }
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'save', side_effect=SQLAlchemyError):
            with pytest.raises(ValueError):
                TenantService.create(tenant_data)


def test_update_tenant(session):
    """Test updating a tenant."""
    tenant_data = {'name': 'Updated Name'}
    tenant = factory_tenant_model()
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'find_by_id', return_value=tenant):
            with patch.object(TenantModel, 'update', return_value=None):
                with patch.object(TenantSchema, 'dump', return_value={**tenant_data, 'short_name': 'GDX'}):
                    result = TenantService.update(tenant.short_name, tenant_data)
                    assert result['name'] == tenant_data['name']


def test_update_tenant_not_found(session):
    """Test updating a tenant that does not exist."""
    tenant_data = {'name': 'Updated Name'}
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'find_by_id', return_value=None):
            with pytest.raises(ValueError):
                TenantService.update('1', tenant_data)


def test_update_tenant_error(session):
    """Test updating a tenant with an error."""
    tenant_data = {'name': 'Updated Name'}
    tenant = factory_tenant_model()
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'find_by_id', return_value=tenant):
            with patch.object(TenantModel, 'update', side_effect=SQLAlchemyError):
                with pytest.raises(ValueError):
                    TenantService.update(tenant.short_name, tenant_data)


def test_delete_tenant(session):
    """Test deleting a tenant."""
    tenant = factory_tenant_model()
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'find_by_id', return_value=tenant):
            with patch.object(TenantModel, 'delete', return_value=None):
                result = TenantService.delete(tenant.short_name)
                assert result['status'] == 'success'
                assert result['message'] == 'Tenant deleted successfully'


def test_delete_tenant_not_found(session):
    """Test deleting a tenant that does not exist."""
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'find_by_id', return_value=None):
            with pytest.raises(ValueError):
                TenantService.delete('1')


def test_delete_tenant_error(session):
    """Test deleting a tenant with an error."""
    tenant = factory_tenant_model()
    with patch.object(authorization, 'check_auth', return_value=True):
        with patch.object(TenantModel, 'find_by_id', return_value=tenant):
            with patch.object(TenantModel, 'delete', side_effect=SQLAlchemyError):
                with pytest.raises(ValueError):
                    TenantService.delete(tenant.short_name)

#!/bin/sh
set -e

# Database credentials are loaded via Kubernetes Secret (dagster-vault-secrets)
# through envFrom in the pod spec. They're already available as environment
# variables when this container starts.
#
# The Vault secrets are synced by a pre-install Helm hook Job that fetches
# credentials from Vault and creates a Kubernetes Secret.

echo "Starting Dagster gRPC server..."
echo "Database credentials loaded from Kubernetes Secret (dagster-vault-secrets)"

# Execute the CMD from Dockerfile
exec "$@"

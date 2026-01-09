# Dagster Helm Chart

This Helm chart deploys Dagster ETL on OpenShift, wrapping the official Dagster Helm chart with additional OpenShift-specific resources.

## Overview

The chart includes:

- **Dagster Webserver (Dagit)**: Web UI for Dagster
- **Dagster Daemon**: Background process for schedules, sensors, and run coordination
- **User Deployments**: ETL code deployment (dagster-etl image)
- **Service Account & RBAC**: Proper permissions for Dagster operations
- **Network Policies**: Security policies for pod communication
- **Vault Secret Sync**: Pre-install Job that syncs Vault secrets to Kubernetes Secret

## Prerequisites

- OpenShift cluster with access to namespace
- Vault configured with appropriate secrets at `{engine}{path}/engagement-patroni`
- PostgreSQL database (engagement-patroni) accessible from the namespace
- Dagster ETL image built and available in the image registry

## Installation

```bash
helm dependency update
helm install dagster . --values values.yaml --values values_{env}.yaml
```

## Upgrading

```bash
helm dependency update
helm upgrade dagster . --values values.yaml --values values_{env}.yaml
```

## Configuration

### Key Configuration Values

| Paraengagementer   | Description                         | Default                   |
| ------------------ | ----------------------------------- | ------------------------- |
| `app.name`         | Application name                    | `dagster`                 |
| `app.licenseplate` | License plate for namespace         | `e903c2`                  |
| `image.namespace`  | Image registry namespace            | `e903c2-tools`            |
| `image.tag`        | Image tag for ETL deployment        | `latest`                  |
| `vault.namespace`  | Vault namespace                     | `platform-services`       |
| `vault.authPath`   | Vault auth path                     | `auth/k8s-gold`           |
| `vault.engine`     | Vault engine (environment-specific) | Set in values\_{env}.yaml |
| `vault.path`       | Vault path (environment-specific)   | Set in values\_{env}.yaml |

### Dagster Configuration

The chart wraps the official Dagster chart. Key overrides:

- **PostgreSQL**: Disabled (uses external engagement-patroni)
- **Redis/RabbitMQ**: Disabled
- **Run Launcher**: K8sRunLauncher (native Kubernetes)
- **Service Account**: Created by this chart
- **Compute Log Manager**: NoOp (no persistent storage)

## Secrets Management

### Vault Secret Sync Job

A pre-install/pre-upgrade Helm hook Job (`dagster-vault-sync`) runs before deployments:

- Uses the `e903c2-vault` ServiceAccount for Vault authentication
- Vault Agent sidecar injects secrets into `/vault/secrets/engagement-patroni`
- Job reads secrets and creates/updates two Kubernetes Secrets:
  - `dagster-vault-secrets`: Contains all database credentials for use via envFrom
  - `dagster-postgresql-secret`: Contains the PostgreSQL password for compatibility with Dagster chart's explicit env var injection

### Kubernetes Secret Structure

The `dagster-vault-secrets` Secret contains:

- `DAGSTER_DB_USER` / `DAGSTER_DB_PASSWORD` - Dagster database credentials
- `DAGSTER_PG_PASSWORD` - PostgreSQL password for Dagster
- `MET_DB_*` - MET database connection info
- `MET_ANALYTICS_DB_*` - Analytics database connection info

All secrets are sourced from Vault at `{engine}{path}/engagement-patroni`.

## ConfigMaps

The Dagster chart creates several ConfigMaps:

1. **`dagster-daemon-env`**: Environment variables for the Dagster daemon, including the pipeline run image configuration
2. **`dagster-pipeline-env`**: Environment variables inherited by all pipeline run pods
3. **`dagster-webserver-env`**: Environment variables for the Dagster webserver
4. **`dagster-instance`**: Dagster instance configuration (dagster.yaml)
5. **`dagster-workspace-yaml`**: Workspace configuration pointing to user deployments

The `pipelineRun` configuration in values files controls what image and environment variables are used when the K8sRunLauncher creates pipeline run pods.

### Secret Consumption

Dagster components load secrets via `envFrom` referencing `dagster-vault-secrets`:

- **Webserver**: Has access to database credentials
- **Daemon**: Has access to database credentials for run coordination
- **User Deployments**: Full access to all database credentials via `envSecrets` configuration
- **Launched Runs**: Inherit secrets through `DAGSTER_CONTAINER_CONTEXT` configuration

## Network Policies

Three network policies are created:

1. **dagster-webserver**: Allows ingress from OpenShift router and other Dagster components
2. **dagster-daemon**: Allows ingress from other Dagster components
3. **dagster-user-deployments**: Allows ingress from other Dagster components

## Service Accounts & RBAC

### Service Accounts

1. **`e903c2-vault`** (pre-existing, not created by this chart)
   - Used by the vault-sync Job
   - Has permissions to authenticate with Vault
   - Has image-pull permissions from e903c2-tools namespace

2. **`dagster`** (created by this chart)
   - Used by all Dagster pods (webserver, daemon, user deployments)
   - Has admin permissions in the namespace to create Jobs, Pods, ConfigMaps, etc.
   - Required for Dagster's Kubernetes-native run launcher

3. **`dagster-dagster-user-deployments-user-deployments`** (created by Dagster subchart)
   - Used by user deployment pods
   - Has image-pull permissions

### RoleBindings

1. **`dagster-admin`**: Grants admin role to `dagster` ServiceAccount
2. **`system-image-puller-dagster-user-deployments`**: Allows pulling images from tools namespace
3. **`dagster-dagster-user-deployments-role`**: Created by Dagster subchart for user deployments

## Accessing Dagster UI

After deployment, port-forward to access the Dagster UI:

```bash
kubectl port-forward svc/dagster-dagster-webserver 8080:8080
```

Navigate to http://localhost:8080

## Troubleshooting

### Check pod status

```bash
kubectl get pods -l app.kubernetes.io/instance=dagster
```

### View logs

```bash
# Webserver
kubectl logs -l component=dagster-webserver

# Daemon
kubectl logs -l component=dagster-daemon

# User deployments (ETL)
kubectl logs -l component=user-deployments
```

### Verify secrets

```bash
kubectl get secret engagement-dagster -o yaml
```

## Deployment Flow

When you run `helm install` or `helm upgrade`:

1. **Pre-Install/Pre-Upgrade Phase**:
   - Vault sync Job is created and runs
   - Job authenticates with Vault using `e903c2-vault` ServiceAccount
   - Secrets are fetched and written to `dagster-vault-secrets` Kubernetes Secret
   - Job completes successfully before deployment proceeds

2. **Main Deployment Phase**:
   - ServiceAccount `dagster` is created
   - RoleBindings grant necessary permissions
   - Dagster webserver, daemon, and user deployment pods are created
   - All pods use `dagster` ServiceAccount and load secrets from `dagster-vault-secrets`

3. **Runtime**:
   - Dagster launches runs as Kubernetes Jobs
   - Runs inherit secrets through `DAGSTER_CONTAINER_CONTEXT`
   - Runs use `dagster` ServiceAccount for execution

## Migration from Manual Deployment

This chart replaces the manual Dagster deployment described in `docs/Steps_To_Deploy_Dagster.md`. Key differences:

- **Automated Vault integration** via pre-install Job (replaces manual secret creation)
- **Dual ServiceAccount architecture** enables both Vault access and Dagster operations
- Network policies included (replaces manual creation)
- Service account and RBAC bundled (replaces manual setup)
- Environment-specific values files (dev/test/prod)
- Secrets automatically sync on each upgrade

## Version

- **Chart Version**: 0.1.0
- **Dagster Version**: 1.4.4

## References

- [Dagster Documentation](https://docs.dagster.io/)
- [Dagster Helm Chart](https://github.com/dagster-io/dagster/tree/master/helm/dagster)

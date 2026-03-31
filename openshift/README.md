# Openshift Configuration

Notes and example commands to deploy MET in an Openshift environment.

## Deployment Configuration

In this project, we use Helm charts to deploy the applications. The charts are located in the `openshift` folder, with subfolders for each application.

### Configurable Parameters

Many parameters can be configured via the `values.yaml` files located in each chart folder. Environment-specific values files are used for values that differ between environments (e.g. `values_dev.yaml`, `values_test.yaml`, `values_prod.yaml`). Not all parameters listed below will be present in every chart.

The following is a non-exhaustive list of configurable parameters.

**General Configuration**
Most charts will have at least these 2 parameters:

- `app.name`: The name of the application.
- `app.licenseplate`: The license plate for the environment (e.g. `e903c2`).
  Other common parameters include:
- `(<app-name>.)resources`: Resource requests and limits for the application pods.

**Image Configuration**

- `image.repository`: The image repository for the application.
- `image.namespace`: The namespace to pull the image from.
- `image.tag`: The image tag to use.

**Access Control Configuration**

- `app.allowIngressPodselectors`: A list of pod selectors that are allowed to access the application via ingress.
  **NOTE**: Dev IP whitelisting is managed via Vault and the setup job, not directly through this parameter.
- `app.ratelimits.enabled`: Enable or disable rate limiting on the application route.
- `app.ratelimits.http`: Maximum number of HTTP connections per IP address over a 3 second interval.
- `app.ratelimits.tcp`: Maximum number of TCP connections per IP address over a 3 second interval.

**Autoscaling Configuration**
Some charts may include parameters for configuring Horizontal Pod Autoscalers (HPA):

- `deployment.minReplicas`: Minimum number of replicas for the HPA.
- `deployment.maxReplicas`: Maximum number of replicas for the HPA.

### Deployment Examples

**Deploy the `Web` application**:

> Accessible to the public: _Yes_
> This deployment uses the helm chart located in the `openshift/web` folder.
> Use one of dev, test or prod and the corresponding values.yaml file to deploy the web application.

```bash
cd ./openshift/web
### Dev
oc project e903c2-dev
helm upgrade --install met-web . --values values_dev.yaml
### Test
oc project e903c2-test
helm upgrade --install met-web . --values values_test.yaml
### Prod
oc project e903c2-prod
helm upgrade --install met-web . --values values_prod.yaml
```

**Deploy the `API` (and `cron`) applications**:

> Accessible to the public: _Yes_ (API only)
> This deployment uses the helm chart located in the `openshift/api` folder.
> This creates 2 deployments as the met-api and met-cron submodules are deployed together.
> Use one of dev, test or prod and the corresponding values.yaml file to deploy the api application.

```bash
cd ./openshift/api
### Dev
oc project e903c2-dev
helm upgrade --install met-api . --values values_dev.yaml
### Test
oc project e903c2-test
helm upgrade --install met-api . --values values_test.yaml
### Prod
oc project e903c2-prod
helm upgrade --install met-api . --values values_prod.yaml
```

**Deploy the `Notify API` application:**

> Accessible to the public: _No_
> To access this application, you need to port-forward the service to your localhost.
> A shortcut to do this is provided in the Notify API makefile (make port-forward).
> This deployment uses the helm chart located in the `openshift/notify-api` folder.
> Use one of dev, test or prod and the corresponding values.yaml file to deploy the notify-api application.

```bash
cd ./openshift/notify
### Dev
oc project e903c2-dev
helm upgrade --install notify-api . --values values_dev.yaml
 ## Port forward the service to localhost (optional)
oc port-forward svc/notify-api 8081:8080 -n e903c2-dev
### Test
oc project e903c2-test
helm upgrade --install notify-api . --values values_test.yaml
### Prod
oc project e903c2-prod
helm upgrade --install notify-api . --values values_prod.yaml
```

**Deploy the `Analytics API` application:**

> Accessible to the public: _No_
> This deployment uses the helm chart located in the `openshift/analytics-api` folder.
> This application is used to collect and process analytics data from the MET applications.
> Use one of dev, test or prod and the corresponding values.yaml file to deploy the analytics-api application.
> The analytics-api is used by the redash application to collect and process analytics data.

```bash
cd ./openshift/analytics-api
### Dev
oc project e903c2-dev
helm upgrade --install met-analytics . --values values_dev.yaml
### Test
oc project e903c2-test
helm upgrade --install met-analytics . --values values_test.yaml
### Prod
oc project e903c2-prod
helm upgrade --install met-analytics . --values values_prod.yaml
```

**Deploy the `Redash` application**:

> Accessible to the public: _No_
> This deployment uses the helm chart located in the `openshift/redash` folder.
> Redash is used to visualize and query the analytics data collected by the analytics-api.

```bash
cd redash
helm dependency build
helm install met-analytics ./ -f ./values.yaml --set redash.image.tag=test
```

**Deploy the `Dagster` application**:

> Accessible to the public: _No_
> This deployment uses the helm chart located in the `openshift/dagster` folder.
> Dagster is used to orchestrate and schedule ETL jobs for the MET applications.
> Use one of dev, test or prod and the corresponding values.yaml file to deploy the dagster application.

```bash
cd ./openshift/dagster
# Update dependencies to pull the official Dagster chart
helm dependency update
### Dev
oc project e903c2-dev
helm upgrade --install dagster . --values values.yaml --values values_dev.yaml
### Test
oc project e903c2-test
helm upgrade --install dagster . --values values.yaml --values values_test.yaml
### Prod
oc project e903c2-prod
helm upgrade --install dagster . --values values.yaml --values values_prod.yaml
```

> **Note**: The Dagster chart wraps the official Dagster Helm chart (version 1.4.4) and adds OpenShift-specific resources including:
>
> - Network Policies for webserver, daemon, and user deployments
> - Vault integration for database credentials
> - Image puller role binding for user deployments

**Deploying the MET RBAC chart**:

> RBAC in this project is managed by the helm chart located in the `openshift/rbac` folder.
> This chart determines its environment based on the namespace it is being deployed to.

Currently the chart creates the following:

1. **Vault Service Account RoleBinding**: This rolebinding allows the vault service account to pull images from the tools namespace.
   > The {licenseplate}-vault service account should be used on Deployments that need access to Vault.
   > In order for the Vault service account to be able to pull images from the tools namespace, this rolebinding must be created.

## Image Puller Configuration

Allow image pullers from the other namespaces to pull images from tools namespace:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: "system:image-puller"
  namespace: e903c2-tools
subjects:
  - kind: ServiceAccount
    name: default
    namespace: e903c2-dev
  - kind: ServiceAccount
    name: default
    namespace: e903c2-test
  - kind: ServiceAccount
    name: default
    namespace: e903c2-prod
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: "system:image-puller"
```

## Database Configuration

Create a highly available PostgreSQL database using Patroni:

```bash
helm install engagement-db . --values values_<env>.yaml
```

If the cluster is not starting, remove any existing ConfigMaps and PersistentVolumeClaims:

```bash
oc delete configmap -l app.kubernetes.io/instance=engagement-db
oc delete pvc -l app.kubernetes.io/instance=engagement-db
```

For technical reasons, we cannot load secrets from Vault during the initial database setup. Therefore, a Secret must be created in each namespace containing the initial database user passwords. These values should match those stored in Vault.

```bash
oc create secret generic engagement-patroni \
--from-literal=superuser-username=postgres \
--from-literal=superuser-password=<superuser-password> \
--from-literal=replication-username=replicator \
--from-literal=replication-password=<replication-password> \
--from-literal=app-db-username=<app-username> \
--from-literal=app-db-password=<app-password> \
--from-literal=app-db-name=app \
-n e903c2-<env>
```

### Setup

1. Users Setup script is located at /tools/postgres/init/00_postgresql-user-setup.sql
1. Initial database setup script is located at /tools/postgres/init/01_postgresql-schema-setup.sql

## IP Whitelist Management

The DEP application uses IP-based access controls on OpenShift Routes to protect non-production environments from unauthorized access. IP whitelists are stored securely in HashiCorp Vault and automatically applied to routes during deployment.

### Vault Secret Structure

IP whitelists are stored in Vault at the following path:

- Dev: `e903c2-nonprod/dev/openshift-ingress-ips`
- Test: `e903c2-nonprod/test/openshift-ingress-ips`
- Prod: `e903c2-prod/openshift-ingress-ips`

The secret should contain the following keys (ALLOW_PUBLIC will be treated as false if not set):

| Key            | Format                                                 | Description                                                 | Example                                |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------- |
| `DEV_IPS`      | Space-separated IPs/CIDRs, prefixed with `(user)name@` | Individual developer IP addresses                           | `developer@192.168.1.100 10.0.0.50/32` |
| `VPN_CIDRS`    | Space-separated CIDR blocks                            | VPN network ranges                                          | `142.34.0.0/16 142.35.0.0/16`          |
| `ALLOW_PUBLIC` | Any non-empty value or omit entirely                   | Set to any value to disable IP restrictions (public access) | `true`                                 |

### Updating IP Whitelists

**Prerequisites:**

- Access to the OpenShift project namespace
- Appropriate Vault permissions

#### Method 1: Update via web interface

Log into the Vault web interface with role `e903c2` and navigate to the appropriate path for your environment (e.g., `e903c2-nonprod/dev/openshift-ingress-ips` for dev). Edit the keys as needed (see format above) and save the changes.

#### Method 2: Update via CLI

**Prerequisites:**

- Access to the OpenShift project namespace
- Appropriate Vault permissions
- Vault CLI installed and configured

Use the following commands to update the IP whitelist in Vault:

```bash
VAULT_ENGINE="e903c2-nonprod"
VAULT_PATH="/dev"

# read old values
vault kv get ${VAULT_ENGINE}${VAULT_PATH}/openshift-ingress-ips

# write new values
vault kv put ${VAULT_ENGINE}${VAULT_PATH}/openshift-ingress-ips \
  DEV_IPS="developer@127.0.0.1 developer2@127.0.0.2" \
  VPN_CIDRS="123.45.67.89/16 255.254.253.252/16" \

```

### Pipeline Service Account

The IP whitelist jobs also require a `pipeline-service-account` secret in Vault containing:

- `PIPELINE_TOKEN`: An OpenShift service account token with permissions to annotate routes

This should be stored at:

```
{vault-engine}{vault-path}/pipeline-service-account
```

## Database Backup / Restore Guide

Backups are generated daily by the "backup" deployment in each namespace and are saved as a gzipped SQL script containing the database structure + data.

Backups are verified nightly at 4 AM by creating a temporary database instance, restoring the backup into it, and checking for tables in the restored database. This is configured in the `backup.conf` file, mounted from the `engagement-db-backup` ConfigMap.

Backups are also uploaded to S3-compatible storage for offsite retention.

### Restoring from S3

**Note**: The backup container does not support restoring directly from S3. If a backup has already been removed from the local FS, you must download it from S3 to the local `/backups/` directory first, then restore using the standard process.

To restore a backup stored in S3:

```bash
# Connect to backup container
oc rsh deploy/engagement-db-backup

# Source S3 credentials
source /vault/secrets/s3

# Configure mc (MinIO Client) for S3 access
mc alias set dell_s3 $S3_ENDPOINT $S3_USER $S3_PASSWORD

# List backups in S3 bucket
mc ls dell_s3/engagement-<env>-backup/ # env is one of dev, test, prod

# Download the desired backup file
mc cp dell_s3/engagement-<env>-backup/engagement-patroni-app_YYYY-MM-DD_HH-MM-SS.sql.gz /backups/

# Now proceed with normal restore process (see scenarios below)
```

### Scenarios

#### 1. Normal Production Restore (Roles Exist)

**Use case**: Restoring to existing Patroni cluster where roles are already defined.

```bash
# Connect to backup container
oc rsh deploy/engagement-db-backup

# Add credentials to environment
source /vault/secrets/engagement-patroni

# List available backups
./backup.sh -l # press Enter if prompted for password

# Restore with -I flag to ignore duplicate role errors
./backup.sh -I -r postgres=engagement-patroni:5432/app -f /backups/<period>/<YYYY-MM-DD>/engagement-patroni-app_<YYYY-MM-DD_HH-MM-SS>.sql.gz
```

**Why `-I`?**: The backup contains `CREATE ROLE` statements at the end. Since roles already exist in production, these will fail but can be safely ignored.

---

#### 2. Emergency Restore (Fresh Database)

**Use case**: Restoring to a completely new PostgreSQL instance that has no existing roles.

```bash
# Connect to backup container
oc rsh deploy/engagement-db-backup

# Source credentials
source /vault/secrets/engagement-patroni

# Use the emergency restore script
./emergency-restore.sh /backups/daily/YYYY-MM-DD/engagement-patroni-app_YYYY-MM-DD_HH-MM-SS.sql.gz app
```

**What it does**:

1. Extracts `CREATE ROLE` statements from the backup
2. Creates all roles first (analytics, app, backup, dagster, met, redash, replication)
3. Restores the full backup (object ownership now works correctly)
4. Ignores duplicate role creation errors at the end of the backup

Note: the users are created without passwords; you will need to set passwords manually after the restore as needed. Existing passwords are stored in Vault but are not extracted by this script. The exception is the superuser account, which has its password set from Vault during db startup.

```bash
# Connect as superuser
oc rsh pod/engagement-patroni-0
psql -U postgres -d app

# Set passwords for each role
ALTER ROLE analytics WITH PASSWORD 'foo';
ALTER ROLE dagster WITH PASSWORD 'bar';
ALTER ROLE met WITH PASSWORD 'baz';
ALTER ROLE redash WITH PASSWORD 'qux';
ALTER ROLE replication WITH PASSWORD 'quux';
```

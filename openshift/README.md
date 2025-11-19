# Openshift Configuration

Notes and example commands to deploy MET in an Openshift environment.

## Deployment Configuration

In this project, we use Helm charts to deploy the applications. The charts are located in the `openshift` folder, with subfolders for each application.

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

**Deploying the MET RBAC chart**:

> RBAC in this project is managed by the helm chart located in the `openshift/rbac` folder.
> This chart determines its environment based on the namespace it is being deployed to.

Currently the chart creates the following:

1. **Vault Service Account RoleBinding**: This rolebinding allows the vault service account to pull images from the tools namespace.
   > The {licenseplate}-vault service account should be used on Deployments that need access to Vault.
   > In order for the Vault service account to be able to pull images from the tools namespace, this rolebinding must be created.

### Additional NetworkPolicies

Setting this ingress policy on all pods allows incoming connections from pods within the same environment (API pods can connect to the database pods):

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-from-same-namespace
  namespace: e903c2-<dev/test/prod>
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              environment: <dev/test/prod>
              name: e903c2
  policyTypes:
    - Ingress
```

Allow public access to your deployed routes by creating the following network policy:

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: allow-from-openshift-ingress
  namespace: e903c2-<ENV>
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              network.openshift.io/policy-group: ingress
  policyTypes:
    - Ingress
```

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

Inntall an instance of patroni using helm chart:

```
helm repo add patroni-chart https://bcgov.github.io/nr-patroni-chart
helm install -n <namespace> met-patroni patroni-chart/patroni
```

If HA is not necessary create a instance of a postgresql database:

```
oc new-app --template=postgresql-persistent -p POSTGRESQL_DATABASE=app -p DATABASE_SERVICE_NAME=met-postgresql
```

### Setup

1. Users Setup script is located at /tools/postgres/init/00_postgresql-user-setup.sql
1. Initial database setup script is located at /tools/postgres/init/01_postgresql-schema-setup.sql
1. Openshift secret yaml is located at ./database-users.secret.yml

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

## Restore Backup Script

Backups are generated daily by the dc "backup" in the test and production realms and are composed by a SQL script containing the database structure + data.

To restore the backup follow these steps:

1. Connect to openshift using the terminal/bash and set the project (test/prod).
1. Transfer the backup file to your local using the command below:

   ```bash
   oc rsync <backup-pod-name>:/backups/daily/<date> <local-folder>
   ```

   This copies the folder and contents from the pod to the local folder.

1. Extract backup script using gzip:

   ```bash
   gzip -d <file-name>
   ```

1. Connect to the patroni database pod using port-forward:

   ```bash
   oc port-forward met-patroni-<master_pod> 5432:5432
   ```

1. Manually create the database (drop if necessary):

   ```bash
   psql -h localhost -p 5432 -U postgres -c 'create database app;'
   ```

1. Manually update with passwords and run the users setup script (if new server):

   ```bash
   psql -h localhost -U postgres -p 5432 -a -q -f ./postgresql-user-setup.sql
   ```

1. Execute the script to restore the database:

   ```bash
   psql -h localhost -d app -U postgres -p 5432 -a -q -f <path-to-file>
   ```

   **Note:** Should the restore fail due to roles not being found, the following psql commands can be run from within the database pod to alter the roles

   ```
     alter role met WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
         PASSWORD 'met';

     alter role analytics WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
         PASSWORD 'analytics';

     alter role keycloak WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
         PASSWORD 'keycloak';

     alter role redash WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
         PASSWORD 'redash';

     alter role dagster WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION
         PASSWORD 'dagster';

   ```

   Once the roles are altered the restore script can be run again.

## Build Configuration

Github actions are being used for building images but **\*\***IF NECESSARY**\*\*** to use openshift,
follow the steps below:

In the tools namespace use the following to create the build configurations:

```
    oc process -f ./buildconfigs/web.bc.yml | oc create -f -
```

```
    oc process -f ./buildconfigs/api.bc.yml | oc create -f -
```

```
    oc process -f ./buildconfigs/notify-api.bc.yml | oc create -f -
```

```
    oc process -f ./buildconfigs/cron.bc.yml | oc create -f -
```

```
    oc process -f ./buildconfigs/met-analytics.bc.yml | oc create -f -
```

```
    oc process -f ./buildconfigs/analytics-api.bc.yml | oc create -f -
```

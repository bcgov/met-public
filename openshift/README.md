# Openshift Configuration

Commands and notes to deploy MET to a Openshift environment.

## Build Configuration

Github actions are being used for building images but **IF NECESSARY** to use openshift, 
follow the steps below:

In the tools namespace use the following to create the build configurations:

```
    oc process -f ./web.bc.yml | oc create -f -
```

```
    oc process -f ./api.bc.yml | oc create -f -
```

```
    oc process -f ./notify-api.bc.yml | oc create -f -
```

```
    oc process -f ./cron.bc.yml | oc create -f -
```

```
    oc process -f ./met-analytics.bc.yml | oc create -f -
```

## Image Puller Configuration

Allow image pullers from the other namespaces to pull images from tools namespace:

```yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: 'system:image-puller'
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
  name: 'system:image-puller'
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

1. Users Setup script is located at ./postgresql-user-setup.sql
1. Initial database setup script is located at ./postgresql-schema-setup.sql
1. Openshift secret yaml is located at ./database-users.secret.yml

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

## Keycloak Configuration

Create an instance of a postgresql database:

In each environment namespace (dev, test, prod) use the following:

Deploy the web application:
```
oc process -f ./keycloak.dc.yml -p ENV=test | oc create -f -
```

The create the initial credentials use port forwarding to access the url as localhost:8080
```
oc port-forward keycloak-<PODNAME> 8080:8080
```

In the keycloak app:
1. create a new realm and click import json, select the file "keycloak-realm-export.json"
1. Request a new client configuration in sso-requests (https://bcgov.github.io/sso-requests/)
1. Update the identity provider client secret and url domains.


## Deployment Configuration

In each environment namespace (dev, test, prod) use the following:

Deploy the web application:
```
oc process -f ./web.dc.yml \
  -p ENV=test \
  -p IMAGE_TAG=test \
  | oc create -f -
```

Deploy the api application:
```
oc process -f ./api.dc.yml \
  -p ENV=test \
  -p IMAGE_TAG=test \
  -p KC_DOMAIN=met-oidc-test.apps.gold.devops.gov.bc.ca \
  -p S3_BUCKET=met-test \
  -p SITE_URL=https://met-web-test.apps.gold.devops.gov.bc.ca \
  -p MET_ADMIN_CLIENT_SECRET=<SERVICE_ACCOUNT_SECRET> \
  -p NOTIFICATIONS_EMAIL_ENDPOINT=https://met-notify-api-test.apps.gold.devops.gov.bc.ca/api/v1/notifications/email \
  | oc create -f -

```

Deploy the notify api application:
```
oc process -f ./notify-api.dc.yml \
  -p ENV=test \
  -p IMAGE_TAG=test \
  -p KC_DOMAIN=met-oidc-test.apps.gold.devops.gov.bc.ca \
  -p GC_NOTIFY_API_KEY=<GC_NOTIFY_API_KEY> \
  | oc create -f -

```

Deploy the cron job application:
```
oc process -f ./cron.dc.yml \
  -p ENV=test \
  -p IMAGE_TAG=test \
  -p KC_DOMAIN=met-oidc-test.apps.gold.devops.gov.bc.ca \
  -p SITE_URL=https://met-web-test.apps.gold.devops.gov.bc.ca \
  -p MET_ADMIN_CLIENT_SECRET=<SERVICE_ACCOUNT_SECRET> \
  -p NOTIFICATIONS_EMAIL_ENDPOINT=https://met-notify-api-test.apps.gold.devops.gov.bc.ca/api/v1/notifications/email \
  | oc create -f -

```

Deploy the redash analytics helm chart:
```
cd redash
helm dependency build
helm install met-analytics ./ -f ./values.yaml --set redash.image.tag=test
```


### Additional NetworkPolicies

Allows the connections between pods whithin the realm (API pods can connect to the database pods):

```yaml
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              environment: test
              name: e903c2
  policyTypes:
    - Ingress
```

Allow public accecss to the created routes by creating the network policy:

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

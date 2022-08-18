# Openshift Configuration

Commands and notes to deploy MET to a Openshift environment.

## Build Configuration

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

## Keycloak Configuration

Create an instance of a postgresql database:

```
oc new-app --template=postgresql-persistent -p POSTGRESQL_DATABASE=keycloak -p DATABASE_SERVICE_NAME=postgresql-keycloak
```

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


## Database Configuration

Create two instance of a postgresql database (transactional and analytics):

```
oc new-app --template=postgresql-persistent -p POSTGRESQL_DATABASE=met -p DATABASE_SERVICE_NAME=postgresql-met
```

```
oc new-app --template=postgresql-persistent -p POSTGRESQL_DATABASE=met-analytics -p DATABASE_SERVICE_NAME=postgresql-edw
```

Create an instance of patroni:

TODO

## Deployment Configuration

In each environment namespace (dev, test, prod) use the following:

Deploy the web application:
```
oc process -f ./web.dc.yml 
  -p ENV=test 
  -p IMAGE_TAG=test 
  | oc create -f -
```

Deploy the api application:
```
oc process -f ./api.dc.yml 
  -p ENV=test 
  -p IMAGE_TAG=test 
  -p KC_DOMAIN=met-oidc-test.apps.gold.devops.gov.bc.ca 
  -p S3_BUCKET=met-test 
  -p SITE_URL=https://met-web-test.apps.gold.devops.gov.bc.ca 
  -p S3_ACCESS_KEY=<S3_KEY> 
  -p MET_ADMIN_CLIENT_SECRET=<SERVICE_ACCOUNT_SECRET> 
  -p NOTIFICATIONS_EMAIL_ENDPOINT=https://met-notify-api-test.apps.gold.devops.gov.bc.ca/api/v1/notifications/email 
  | oc create -f -

```

Deploy the notify api application:
```
oc process -f ./notify-api.dc.yml 
  -p ENV=test 
  -p IMAGE_TAG=test 
  -p KC_DOMAIN=met-oidc-test.apps.gold.devops.gov.bc.ca 
  -p GC_NOTIFY_API_KEY=<GC_NOTIFY_API_KEY>
  | oc create -f -

```

Deploy the cron job application:
```
oc process -f ./cron.dc.yml 
  -p ENV=test 
  -p IMAGE_TAG=test 
  -p KC_DOMAIN=met-oidc-test.apps.gold.devops.gov.bc.ca 
  -p SITE_URL=https://met-web-test.apps.gold.devops.gov.bc.ca 
  -p MET_ADMIN_CLIENT_SECRET=<SERVICE_ACCOUNT_SECRET> 
  -p NOTIFICATIONS_EMAIL_ENDPOINT=https://met-notify-api-test.apps.gold.devops.gov.bc.ca/api/v1/notifications/email 
  | oc create -f -

```

Deploy the redash analytics helm chart:
```
cd redash
helm dependency build
helm install met-analytics ./ -f ./values.yaml
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

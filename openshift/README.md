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

TODO

## Formio Configuration

TODO

## Database Configuration

Create an instance of a postgresql database:

```
oc new-app --template=postgresql-persistent -p POSTGRESQL_DATABASE=met -p DATABASE_SERVICE_NAME=postgresql-met
```

Create an instance of patroni:

TODO

## Deployment Configuration

In each environment namespace (dev, test, prod) use the following:

Deploy the web application:
```
oc process -f ./web.dc.yml -p ENV=test | oc create -f -
```

Deploy the api application:
```
oc process -f ./api.dc.yml -p ENV=test | oc create -f -
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

# Locust Load Testing Helm Chart

This Helm chart deploys Locust, a scalable load testing tool, on OpenShift.

## Prerequisites

- OpenShift cluster access
- `oc` CLI installed
- Helm 3.x installed
- Vault service account (`e903c2-vault`) configured in namespace
- Vault secrets configured:
  - `openshift-ingress-ips` - Contains allowed IPs and VPN CIDRs
  - `pipeline-service-account` - Contains service account token for route annotation

## Quick Start

### Install

```bash
# Development
oc project e903c2-dev
helm install locust ./openshift/locust -f ./openshift/locust/values_dev.yaml

# Test
oc project e903c2-test
helm install locust ./openshift/locust -f ./openshift/locust/values_test.yaml

# Production
oc project e903c2-prod
helm install locust ./openshift/locust -f ./openshift/locust/values_prod.yaml
```

### Upgrade

```bash
helm upgrade locust ./openshift/locust -f ./openshift/locust/values_<env>.yaml
```

### Uninstall

```bash
helm uninstall locust
```

### How to Use

1. Access the Locust UI (see below)
2. Click "New test"
3. **Select user classes** from the dropdown
4. Set number of users and spawn rate
5. Start the test

## Access Locust UI

```bash
# Get route URL
oc get route locust-master -n e903c2-dev

# Or port-forward (if route is IP-restricted)
oc port-forward service/locust-master 8089:8089 -n e903c2-dev
# Then open http://localhost:8089
```

## Selecting User Behaviours

The chart leverages the locust Class Picker feature to allow dynamic selection of user behaviour classes at test start time.

### Available User Classes

When you start a test in the Locust UI, you'll see these user types optimized for different testing scenarios:

1. RealisticAPIUser - Realistic API patterns (ENABLED by default - 70% weight)
2. RealisticFrontendUser - Realistic frontend browsing (ENABLED by default - 30% weight)
3. HeavyAPIUser - Hammers API endpoints for HPA tuning and stress testing (DISABLED by default)
4. HeavyFrontendUser - Heavy frontend load (DISABLED by default)

**Default behaviour (no user class specified)**

```bash
locust -f locustfile.py --host https://met-web-dev.apps.gold.devops.gov.bc.ca
```

Runs: `RealisticAPIUser` (70%) + `RealisticFrontendUser` (30%) — typical production load pattern.

**Stress testing (enable heavy users)**

```bash
# API HPA tuning
locust -f locustfile.py HeavyAPIUser --host https://...

# Full system stress test
locust -f locustfile.py HeavyAPIUser HeavyFrontendUser --host https://...
```

**Usage with tags**

```bash
# Run heavy load tests (must explicitly enable)
locust -f locustfile.py --tags heavy --host https://...

# Run realistic tests (same as default)
locust -f locustfile.py --tags realistic --host https://...
```

**From the web UI**, simply check the desired user classes before starting the test.
You may have to adjust the weights to achieve the desired workload distribution.

## Installation

### Environment-Specific Installation

The chart includes pre-configured values files for each environment:

**Development Environment:**

```bash
oc project e903c2-dev
helm install locust ./openshift/locust -f ./openshift/locust/values-dev.yaml
```

**Test Environment:**

```bash
oc project e903c2-test
helm install locust ./openshift/locust -f ./openshift/locust/values-test.yaml
```

**Production Environment:**

```bash
oc project e903c2-prod
helm install locust ./openshift/locust -f ./openshift/locust/values-prod.yaml
```

## Configuration

Key configuration options in `values.yaml`:

| Parameter                      | Description                 | Default                                               |
| ------------------------------ | --------------------------- | ----------------------------------------------------- |
| `namespace`                    | Target namespace            | `e903c2-dev`                                          |
| `app.name`                     | Application name            | `locust`                                              |
| `app.licenseplate`             | License plate for Vault SA  | `e903c2`                                              |
| `vault.namespace`              | Vault namespace             | `platform-services`                                   |
| `vault.authPath`               | Vault auth path             | `auth/k8s-gold`                                       |
| `vault.engine`                 | Vault KV engine             | `e903c2_kv2`                                          |
| `vault.path`                   | Vault secret path           | `/data/e903c2`                                        |
| `master.replicas`              | Number of master pods       | `1`                                                   |
| `master.config.target-host`    | Target URL for load testing | `https://met-web-dev.apps.gold.devops.gov.bc.ca/gdx/` |
| `worker.replicas`              | Number of worker pods       | `2`                                                   |
| `networkPolicy.enabled`        | Enable NetworkPolicy        | `true`                                                |
| `route.enabled`                | Enable OpenShift Route      | `true`                                                |
| `route.ipRestrictions.enabled` | Enable IP whitelisting      | `true`                                                |

## Accessing the Web UI

After installation, get the route URL:

```bash
oc get route locust-master -n e903c2-dev
```

**Note:** If IP restrictions are enabled, you must access the UI from an allowed IP address or VPN. The ingress protection job automatically applies IP whitelisting based on Vault configuration.
If you cannot access the route, use port-forwarding:

```bash
oc port-forward deployment/locust-master 8089:8089 -n e903c2-dev
# Locust is now accessible at http://localhost:8089
```

Open the URL in your browser to access the Locust web UI.

## Updating the Locustfile

Edit the ConfigMap:

```bash
oc edit configmap locust-config -n e903c2-dev
```

Or update via Helm:

```bash
helm upgrade locust ./openshift/locust --set locustfile.content="..."
```

## Scaling Workers

```bash
# Scale to 5 workers
helm upgrade locust ./openshift/locust --set worker.replicas=5

# Or use kubectl/oc
oc scale deployment locust-worker --replicas=5 -n e903c2-dev
```

**Vault Secret Structure:**

```yaml
# Secret: openshift-ingress-ips
DEV_IPS: "user1@192.168.1.1 user2@192.168.1.2"
VPN_CIDRS: "10.0.0.0/8 172.16.0.0/12"
ALLOW_PUBLIC: "" # Set to any value to allow public access
```

## Troubleshooting

```bash
# Check pod status
oc get pods -l app=locust -n e903c2-dev

# View master logs
oc logs -l app=locust,component=master -n e903c2-dev -f

# View worker logs
oc logs -l app=locust,component=worker -n e903c2-dev -f

# Check ConfigMap
oc get configmap locust-config -n e903c2-dev -o yaml

# Scale workers
oc scale deployment locust-worker --replicas=5 -n e903c2-dev
```

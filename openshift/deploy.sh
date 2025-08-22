oc project $2-tools

oc tag met-api:latest met-api:$1
oc tag notify-api:latest notify-api:$1
oc tag analytics-api:latest analytics-api:$1
oc tag met-cron:latest met-cron:$1
oc tag met-web:latest met-web:$1
oc tag met-analytics:latest met-analytics:$1
oc tag dagster-etl:latest dagster-etl:$1

oc rollout status deployment/met-api -n $2-$1 -w
oc rollout status deployment/met-web -n $2-$1 -w

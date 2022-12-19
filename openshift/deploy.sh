oc project e903c2-tools
oc tag met-api:latest met-api:$1
oc tag notify-api:latest notify-api:$1
oc tag met-cron:latest met-cron:$1
oc tag met-web:latest met-web:$1
oc tag met-analytics:latest met-analytics:$1
oc tag dagster-etl:latest dagster-etl:$1

oc rollout status dc/met-api -n e903c2-$1 -w
oc rollout status dc/met-web -n e903c2-$1 -w

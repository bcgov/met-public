1) On Openshift:
    Go to system:image-puller in rolebindings and add the following lines in the subject:

    - kind: ServiceAccount
      name: dagster-dagster-user-deployments-user-deployments
      namespace: c72cba-prod

2) Change Passwords:
    Update the passwords in the values.yaml file located in the repo.

3) Install Dagster:
    Run the following command to install Dagster using Helm:

    helm install dagster dagster/ --values dagster/values.yaml

4) Create met-dagster Secret:
    Ensure that you create the met-dagster secret file.
    
5) Role Bindings:
    Add dagster-admin to role bindings.

Note: As of now, we are using Dagster version 1.4.4.
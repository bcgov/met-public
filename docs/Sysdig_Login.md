# Logging into Sysdig

The Platform Services team provides a Sysdig integration in each Kubernetes project. This integration allows you to monitor and troubleshoot your applications and infrastructure using Sysdig's powerful features.

## Accessing Sysdig

Once you have the necessary permissions, you can log in to Sysdig using SSO:

### Option 1: Direct link

Use the following link to access Sysdig directly with SSO:
[Sysdig SSO Login](https://app.sysdigcloud.com/api/oauth/openid/bcdevops)

### Option 2: Via Sysdig console

1. Navigate to the Sysdig console at [app.sysdigcloud.com](https://app.sysdigcloud.com/).
2. Under "Login with:", select the OpenID logo.
3. In the field labeled "Enter the company name", type `bcdevops` (all lowercase!) and click "Continue". You do not need to fill out the field labeled "SSO Integration Name (Optional)".
4. You may be redirected to the IDIR login page. Enter your IDIR credentials to log in.

After your identity is verified, you may be presented with a popup called "Welcome to Sysdig Secure for OpenShift in BCGov". Click "Accept" to proceed.

## Finding Your Project

After logging in, you will need to select your project from the list of available projects. Hover over your name, then under "My Teams", select the team corresponding to your project (e.g., `<licenseplate>-team`).

### Viewing Dashboards

Once you have selected your project team, you can access the dashboards specific to your project. Navigate to the "Dashboards" section in the Sysdig interface to view pre-configured dashboards or create custom ones based on your monitoring needs.
Check out the "Shared by my team" tab for dashboards created and shared by other team members.

### Creating Dashboards

To create a new dashboard, click on the "Create Dashboard" button in the Dashboards section or pick a template from the Dashboard library. You can customize the dashboard by adding various widgets and metrics relevant to your applications and infrastructure. For more information on the Sysdig query language and dashboard creation, refer to the [Sysdig Documentation](https://docs.sysdig.com/en/sysdig-monitor/dashboards/#create-a-new-dashboard).

## Permissions

To enable your IDIR login / email addres for sysdig access, you have two options:

1. **Request access from somsone else** in your team who already has access to Sysdig. They can add you as a user with the appropriate permissions. Developers are typically added as the "Advanced User" role.
   Users can be added from the user menu (hover over your name) > Access Management > Teams > Select your team > Team Users tab > Assign User.
   You may have to log in via SSO first to show up in the

2. **Modify the SysdigTeams resource** for your project in OpenShift to include your government email address. This requires edit permissions on the SysdigTeams resource.
   - Log in to the OpenShift console.
   - Select the project where you want to modify the SysdigTeams resource.
   - Select the "tools" namespace.
   - Navigate to the Search page under the Administrator view.
   - Filter by resource type and type "SysdigTeam". Check the box to show only SysdigTeam resources.
   - Select the SysdigTeam resource for your project (<licenseplate>-sysdigteam).
   - Edit the resource to add a new under the spec.team.users section with:

   ```yaml
    spec:
    team:
       description: (Optional description of the team)
       users:
       - name: example.user@gov.bc.ca
           role: ROLE_TEAM_EDIT
       - name: second.example@gov.bc.ca
           role: ROLE_TEAM_VIEW
       # Additional roles as needed
   ```

   Possible roles include:

   | Role ID           | Description    |
   | ----------------- | -------------- |
   | ROLE_TEAM_EDIT    | Advanced User  |
   | ROLE_TEAM_VIEW    | Standard User  |
   | ROLE_TEAM_READ    | Read-Only User |
   | ROLE_TEAM_MANAGER | Team Manager   |

   Alternatively, you can use the `oc` command line tool to edit the SysdigTeam resource:

   ```bash
   oc edit sysdigteam <licenseplate>-sysdigteam -n <licenseplate>-tools
   ```

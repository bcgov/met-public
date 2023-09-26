# Creating a Kubernetes Secret for Basic Authentication with Multiple Users

In Kubernetes, you can create a Secret to store an `.htpasswd` file for basic authentication with multiple username and password pairs. This guide will walk you through the process.

## Step 1: Generate `.htpasswd` Entries

1. Open your terminal.

2. For each user, generate an `.htpasswd` entry using the `htpasswd` command. Replace `<username>` and `<password>` with the actual username and password you want to create:

   ```shell
   htpasswd -bn <username> <password>


This will produce an entry in the format username:hashed_password.

Repeat the above step for each user to create their respective .htpasswd entries.

Step 2: Combine Entries into .htpasswd File
Create a text file (e.g., htpasswd.txt) in your working directory.

Copy and paste the .htpasswd entries into the file, one entry per line:

```shell
username1:hashed_password1
username2:hashed_password2
# Add more entries as needed

```
Step 3: Base64 Encode .htpasswd File
In your terminal, run the following command to base64 encode the entire .htpasswd file:

```shell
cat htpasswd.txt | base64

```

Step 4: Create Kubernetes Secret
Create a Kubernetes Secret with the base64-encoded .htpasswd content. Use the following YAML as an example:

```shell
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
data:
  htpasswd: base64_encoded_htpasswd_content

```
Replace my-secret with your desired Secret name and base64_encoded_htpasswd_content with the actual base64-encoded content from the previous step.
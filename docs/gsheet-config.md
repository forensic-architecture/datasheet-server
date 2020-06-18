## [Configuration](#configuration)
Copy the example environment file:
```
cp .env.example .env
```
Inside this file, you will need to modify at least the `SERVICE_ACCOUNT_EMAIL` and `SERVICE_ACCOUNT_PRIVATE_KEY` fields. These fields refer to the credentials of a [Google service account](https://cloud.google.com/iam/docs/understanding-service-accounts). Google requires that developers create these when attempting to access their services programmatically, so that they can attribute requests to users. Service accounts also contain identity information, which means that asset owners can allow certain service accounts access to certain sheets, just as one might differentially grant certain users access to certain cloud assets. 

Once you have [created a service account](https://support.google.com/a/answer/7378726?hl=en), create and download an [API key for that account](https://cloud.google.com/iam/docs/creating-managing-service-account-keys). The JSON file for the API key that you download when you create it contains both a service account private key, and an email associated with the service account: add these respectively in the strings in .env for `SERVICE_ACCOUNT_PRIVATE_KEY` and `SERVICE_ACCOUNT_EMAIL`.

The last thing to do is to grant the service account access to the sheet that
datasheet-server is pulling from. You can add a service account to a sheet as
you would any other Google user: just enter the email address associated. (Note
that this step is not necessary if you are accessing a publicly available
sheet.)

Other configuration options, such as the port at which the server will expose
resources, are also modifiable from the .env file.



# localstack-cognito-idp-bug

Full reproduction of the clientMetadata bug in Localstack's paid Cognito mock

### Steps

1. Copy `.env.example` to `.env` and add follow the instructions in the file.
1. Run `npm install`
1. Run `docker compose up --build`

Then in a new tab run these commands

```
node src/setup.js

aws cognito-idp sign-up --client-id localuserpoolclient --username aj@email.test --password aBcdefg987@ --region us-east-1 --endpoint-url http://localhost:4566

# Get the UserSub value from the prior command's output and replace ##UserSub## in the next command
# From the localstack container, get the confirmation code from the logs and replace ##ConfirmationCode## in the next command

aws cognito-idp confirm-sign-up --client-id localuserpoolclient --username ##UserSub## --confirmation-code ##ConfirmationCode## --client-metadata '{"testing":"true"}' --region us-east-1 --endpoint-url http://localhost:4566
```

If you want to teardown the created resources without stopping Docker and removing the persistence folder, run

```
node src/teardown.js
```

This may help for more rapid iteration. Run `node src/setup.js` again to recreate the resources.

### The Bug

The lambda log output should include parameters in `clientMetadata`. Currently it only passes `clientMetadata: {}` to the lambda.

See https://github.com/localstack/localstack/issues/11849 for more details.
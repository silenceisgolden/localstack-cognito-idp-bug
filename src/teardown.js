const {
  DeleteFunctionCommand,
  LambdaClient,
} = require('@aws-sdk/client-lambda');

const {
	CognitoIdentityProviderClient,
  DeleteUserPoolClientCommand,
  DeleteUserPoolCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const run = async () => {
  const cognito = new CognitoIdentityProviderClient({
    endpoint: `http://localhost:4566`,
		region: 'us-east-1',
  });

  const lambda = new LambdaClient({
    endpoint: `http://localhost:4566`,
		region: 'us-east-1',
  });

  /**
   * Remove resources in reverse order from the setup script
   */

  try {
    await cognito.send(new DeleteUserPoolClientCommand({
      UserPoolId: 'us-east-1_localuserpool',
      ClientId: 'localuserpoolclient',
    }));
  
    console.log(`Deleted user pool client`);
  } catch (err) {
    console.error(err);
  }

  try {
    await cognito.send(new DeleteUserPoolCommand({
      UserPoolId: 'us-east-1_localuserpool',
    }));

    console.log(`Deleted user pool`);
  } catch (err) {
    console.error(err);
  }

  try {
    await lambda.send(new DeleteFunctionCommand({
      FunctionName: 'local-cognito',
    }));

    console.log(`Deleted function`);
  } catch (err) {
    console.error(err);
  }
};

run();
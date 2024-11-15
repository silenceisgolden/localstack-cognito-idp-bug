const {
  CreateFunctionCommand,
  LambdaClient,
} = require('@aws-sdk/client-lambda');

const {
  CognitoIdentityProviderClient,
	CreateUserPoolCommand,
	CreateUserPoolClientCommand,
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

  const lambdaResponse = await lambda.send(new CreateFunctionCommand({
    FunctionName: 'local-cognito',
    Code: {
      S3Bucket: 'hot-reload',
			S3Key: `$LAMBDA_MOUNT_CWD/src/functions`,
    },
    Handler: 'cognito.handler',
    Runtime: 'nodejs20.x',
    Role: 'arn:aws:iam::000000000000:role/lambda-role',
  }));

  console.log(`Created lambda - ${lambdaResponse.FunctionArn}`);

  const userPoolResponse = await cognito.send(new CreateUserPoolCommand({
    PoolName: 'local-user-pool',
    AutoVerifiedAttributes: ['email'],
    UsernameAttributes: ['email'],
    UsernameConfiguration: {
			CaseSensitive: false,
		},
    LambdaConfig: {
			PostConfirmation:
				'arn:aws:lambda:us-east-1:000000000000:function:local-cognito',
		},
    UserAttributeUpdateSettings: {
			AttributesRequireVerificationBeforeUpdate: ['email'],
		},
		UserPoolTags: {
			_custom_id_: 'us-east-1_localuserpool',
		},
  }));

  console.log(`Created user pool - ${userPoolResponse.UserPool?.Arn}`);

  const userPoolClientResponse = await cognito.send(new CreateUserPoolClientCommand({
    ClientName: '_custom_id_:localuserpoolclient',
		UserPoolId: 'us-east-1_localuserpool',
		GenerateSecret: false,
		RefreshTokenValidity: 90,
		AccessTokenValidity: 60,
		IdTokenValidity: 60,
		/**
		 * Allow emulator login
		 */
		ExplicitAuthFlows: ['ALLOW_USER_SRP_AUTH', 'ALLOW_USER_PASSWORD_AUTH'],
		AuthSessionValidity: 3,
  }));

  console.log(`Created user pool client - ${userPoolClientResponse.UserPoolClient?.ClientId}`);
};

run();
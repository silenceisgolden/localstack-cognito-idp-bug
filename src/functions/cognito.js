/**
 * Cognito lambda trigger handler
 */

const handler = async (event) => {
  console.log(JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

module.exports = {
  handler,
};
import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDBClient";

interface ITodo {
  id: string;
  user_id: string;
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "todos",
      FilterExpression: "user_id = :userid",
      ExpressionAttributeValues: {
        ":userid": userid,
      },
    })
    .promise();

  const todo = response.Items[0] as ITodo;

  if (todo) {
    return {
      statusCode: 201,
      body: JSON.stringify(todo),
    };
  }

  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "Todo not found!",
    }),
  };
};

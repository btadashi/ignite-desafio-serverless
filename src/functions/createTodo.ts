import { v4 as uuidV4 } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoDBClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const id = uuidV4();

  await document
    .put({
      TableName: "todos",
      Item: {
        id,
        user_id: userid,
        title,
        done: false,
        deadline: new Date(deadline).toUTCString(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};

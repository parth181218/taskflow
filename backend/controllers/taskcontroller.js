const { PutCommand, UpdateCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../config/db");
require("dotenv").config();

const TABLE_NAME = process.env.DYNAMO_TABLE;

exports.createTask = async (req, res) => {
  const { boardId, columnId, title, description, assignedTo, dueDate } = req.body;

  const taskId = uuidv4();

  const taskItem = {
    pk: `BOARD#${boardId}`,
    sk: `TASK#${taskId}`,
    taskId,
    boardId,
    columnId,
    title,
    description,
    assignedTo,
    dueDate,
    createdAt: new Date().toISOString()
  };

  try {
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: taskItem
    }));

    res.status(201).json({ message: "Task created", task: taskItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateTaskColumn = async (req, res) => {
  const { boardId, newColumnId } = req.body;
  const { taskId } = req.params;

  const pk = `BOARD#${boardId}`;
  const sk = `TASK#${taskId}`;

  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk, sk },
      UpdateExpression: "SET columnId = :col",
      ExpressionAttributeValues: {
        ":col": newColumnId
      }
    }));

    res.status(200).json({ message: "Task moved to new column", taskId, newColumnId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasksByBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const result = await ddbDocClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "pk = :pk and begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": `BOARD#${boardId}`,
        ":sk": "TASK#"
      }
    }));

    res.status(200).json({ tasks: result.Items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

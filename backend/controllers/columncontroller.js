const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const ddbDocClient = require("../config/db");
require("dotenv").config();

const TABLE_NAME = process.env.DYNAMO_TABLE;

exports.createColumn = async (req, res) => {
  const { boardId, title, order } = req.body;

  const columnId = uuidv4();

  const columnItem = {
    pk: `BOARD#${boardId}`,
    sk: `COLUMN#${columnId}`,
    columnId,
    boardId,
    title,
    order,
    createdAt: new Date().toISOString()
  };

  try {
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: columnItem
    }));

    res.status(201).json({ message: "Column created", column: columnItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

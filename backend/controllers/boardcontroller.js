const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = require("../config/db");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const TABLE_NAME = process.env.DYNAMO_TABLE;

exports.createBoard = async (req, res) => {
  const { title } = req.body;
  const email = req.user.email;
  const boardId = uuidv4();

  const boardItem = {
    pk: `USER#${email}`,
    sk: `BOARD#${boardId}`,
    boardId,
    title,
    createdAt: new Date().toISOString()
  };

  try {
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: boardItem
    }));

    res.status(201).json({ message: "Board created", board: boardItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

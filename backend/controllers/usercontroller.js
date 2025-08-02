const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ddbDocClient = require("../config/db");
require("dotenv").config(); // ✅ ADD THIS LINE


const TABLE_NAME = process.env.DYNAMO_TABLE;

// Register a new user
exports.registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userItem = {
    pk: `USER#${email}`,
    sk: "PROFILE",
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  try {
    await ddbDocClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: userItem
    }));
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const pk = `USER#${email}`;

  try {
    const { Item } = await ddbDocClient.send(new GetCommand({
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        pk: pk,
        sk: "PROFILE"
      }
    }));

    if (!Item) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, Item.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: Item.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: Item.name,
        email: Item.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

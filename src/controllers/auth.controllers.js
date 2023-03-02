import connection from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function createUser(req, res) {
  const user = res.locals.user;

  try {
    const encryptedPass = bcrypt.hashSync(user.password, 10);

    await connection.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [user.name, user.email, encryptedPass]
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function signIn(req, res) {
  const user = res.locals.user;

  try {
    const token = uuid();
    ("SELECT * FROM users WHERE email=$1");
    const userId = await connection.query(
      "SELECT id FROM users WHERE email=$1",
      [user.email]
    );
    console.log(userId.rows[0].id);

    await connection.query(
      'INSERT INTO sessions ("userId", token) VALUES ($1, $2)',
      [userId.rows[0].id, token]
    );

    return res.status(200).send({ token: token });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

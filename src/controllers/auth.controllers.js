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

    const userId = await connection.query("SELECT id from users WHERE=$1", [
      user.email,
    ]);

    const session = {
      userId: userId,
      token: token
    }
await connection.query("INSERT INTO ")
    return res.status(200).send(token);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

import connection from "../database/database.connection.js";
import bcrypt from "bcrypt";

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

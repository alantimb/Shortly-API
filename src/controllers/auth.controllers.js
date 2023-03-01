import connection from "../database/db.js";

export async function createUser(req, res) {
  const user = res.locals.user;

  try {
    await connection.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      user.name,
      user.email,
    ]);

    return res.status(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

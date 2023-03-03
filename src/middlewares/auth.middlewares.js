import connection from "../database/database.connection.js";
import { signInSchema, signUpSchema } from "../schemas/auth.schemas.js";
import bcrypt from "bcrypt";

export async function userSchemaValidation(req, res, next) {
  const user = req.body;

  try {
    const { error } = signUpSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }

    const userExists = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [user.email]
    );
    if (userExists.rowCount > 0) {
      return res.sendStatus(409);
    }

    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function signInSchemaValidation(req, res, next) {
  const user = req.body;

  try {
    const { error } = signInSchema.validate(user, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }

    const userExists = await connection.query(
      "SELECT * FROM users WHERE email=$1",
      [user.email]
    );
    if (userExists.rowCount === 0) {
      return res.sendStatus(401);
    }

    const passwordIsOk = bcrypt.compareSync(
      user.password,
      userExists.rows[0].password
    );
    if (!passwordIsOk) return res.sendStatus(401);

    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function authRoutesValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    const session = await connection.query(
      "SELECT * FROM sessions WHERE token=$1",
      [token]
    );
    if (session.rows.length === 0) return res.sendStatus(401);

    const user = await connection.query("SELECT * FROM users WHERE id=$1", [
      session.rows[0].userId,
    ]);
    
    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

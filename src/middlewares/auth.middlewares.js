import connection from "../database/database.connection.js";
import { signInSchema, signUpSchema } from "../schemas/signup.schema.js";
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

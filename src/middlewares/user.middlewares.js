import connection from "../database/db.js";
import { signUpSchema } from "../schemas/signup.schema.js";

export async function validSchemaUser(req, res, next) {
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

    if (userExists) {
      return res.sendStatus(409);
    }

    res.locals.user = user;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

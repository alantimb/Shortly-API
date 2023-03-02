import { urlSchema } from "../schemas/urls.schema.js";

export async function urlSchemaValidation(req, res, next) {
  const user = res.locals.user;
  const url = req.body;

  try {
    const { error } = urlSchema.validate(url);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send({ errors });
    }

    res.locals.user = user;
    res.locals.url = url;
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

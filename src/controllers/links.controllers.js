import { nanoid } from "nanoid";
import connection from "../database/database.connection.js";

export async function shortUrl(req, res) {
  const user = res.locals.user;
  const url = res.locals.url;

  const shorten = nanoid(8);

  const urls = {
    userId: user.rows[0].id,
    url: url.url,
    shortUrl: shorten,
  };

  try {
    await connection.query(
      'INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)',
      [urls.userId, urls.url, urls.shortUrl]
    );

    const findShorten = await connection.query(
      'SELECT * FROM urls WHERE "shortUrl"=$1',
      [urls.shortUrl]
    );
    return res
      .status(201)
      .send({
        id: findShorten.rows[0].id,
        shortUrl: findShorten.rows[0].shortUrl,
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

import { nanoid } from "nanoid";
import connection from "../database/database.connection.js";

export async function createShortUrl(req, res) {
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
    return res.status(201).send({
      id: findShorten.rows[0].id,
      shortUrl: findShorten.rows[0].shortUrl,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function findShortenUrl(req, res) {
  const { id } = req.params;

  try {
    const urlExists = await connection.query("SELECT * FROM urls WHERE id=$1", [
      id,
    ]);
    if (urlExists.rows.length === 0) return res.sendStatus(404);

    const urlAndShorten = {
      id: urlExists.rows[0].id,
      shortUrl: urlExists.rows[0].shortUrl,
      url: urlExists.rows[0].url,
    };
    return res.status(200).send(urlAndShorten);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function goToShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const shortUrlExists = await connection.query(
      'SELECT * FROM urls WHERE "shortUrl"=$1',
      [shortUrl]
    );
    if (shortUrlExists.rows.length === 0) return res.sendStatus(404);

    let visits = parseInt(shortUrlExists.rows[0].visitCount);
    visits++;

    await connection.query('UPDATE urls SET "visitCount"=$1 WHERE id=$2', [
      visits,
      shortUrlExists.rows[0].id,
    ]);

    return res.redirect(shortUrlExists.rows[0].url);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function deleteShortUrl(req, res) {
    
}

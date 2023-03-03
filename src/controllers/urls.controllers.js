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
  const { id } = req.params; // id do shortUrl
  const user = res.locals.user;

  try {
    const urlExists = await connection.query("SELECT * FROM urls WHERE id=$1", [
      id,
    ]);

    if (urlExists.rows.length === 0) return res.sendStatus(404);
    if (urlExists.rows[0].userId !== user.rows[0].id)
      return res.sendStatus(401);

    const deleteShort = await connection.query("DELETE FROM urls WHERE id=$1", [
      id,
    ]);

    return res.status(204).send(deleteShort);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function visitRank(req, res) {
  try {
    const users = await connection.query("SELECT * FROM users");
    const usersRanking = [];

    for (let i = 0; i < users.rows.length; i++) {
      const urlsLinksCount = await connection.query(
        'SELECT COUNT(*) FROM urls WHERE "userId"=$1',
        [users.rows[i].id]
      );
      const urlsVisitCount = await connection.query(
        'SELECT SUM("visitCount") FROM urls WHERE "userId"=$1',
        [users.rows[i].id]
      );
      const userObject = {
        id: users.rows[i].id,
        name: users.rows[i].name,
        linksCount: urlsLinksCount.rows[0].count,
        visitCount:
          urlsVisitCount.rows[0].sum === null ? 0 : urlsVisitCount.rows[0].sum,
      };

      if (usersRanking.length >= 10) {
        break;
      } else {
        usersRanking.push(userObject);
      }
    }
    usersRanking.sort(function (a, b) {
      return parseInt(a.visitCount) < parseInt(b.visitCount)
        ? 1
        : parseInt(a.visitCount) > parseInt(b.visitCount)
        ? -1
        : 0;
    });

    return res.status(200).send(usersRanking);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

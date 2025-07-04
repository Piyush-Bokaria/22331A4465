import express from 'express';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;
const base = `http://localhost:3000/shorturls`;
const valid = 7 * 24 * 60 * 60 * 1000;

const db = {};

app.use(express.json());

app.post('/shorturls', (req, res) => {
    const { url, validity, shortcode } = req.body;

    try { new URL(url); } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    let code = shortcode || nanoid(6);

    if (db[code]) {
        return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const now = Date.now();
    const ttl = validity ? Number(validity) : valid;
    const expiry = new Date(now + ttl);

    db[code] = {
        originalUrl: url,
        expiry: expiry,
        clicks: 0,
    };

    return res.json({
        shortlink: `${base}/${code}`,
        expiry: expiry.toISOString()
    });
});

app.get('/shorturls/:shortcode', (req, res) => {
    const { shortcode } = req.params;
    const entry = db[shortcode];

    if (!entry) return res.status(404).json({ error: 'Shortlink not found' });
    if (Date.now() > entry.expiry.getTime()) return res.status(410).json({ error: 'Shortlink expired' });

    entry.clicks += 1;
    return res.redirect(entry.originalUrl);
});

app.get('/shorturls/:shortcode/stats', (req, res) => {
    const { shortcode } = req.params;
    const entry = db[shortcode];

    if (!entry) return res.status(404).json({ error: 'Shortlink not found' });

    return res.json({
        originalUrl: entry.originalUrl,
        clicks: entry.clicks,
        expiry: entry.expiry.toISOString()
    });
});

app.listen(port, () => {
    console.log(`URL shortener running at ${base}`);
});

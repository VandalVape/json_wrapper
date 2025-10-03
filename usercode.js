const fetch = require('node-fetch');

module.exports = async (data = {}) => {
  const url = typeof data.url === 'string' ? data.url.trim() : '';
  if (!url) throw new Error('Missing or invalid "url" parameter');

  const res = await fetch(url, { redirect: 'follow' });

  const headers = {};
  res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });

  let body;
  const ct = (headers['content-type'] || '').toLowerCase();
  if (ct.includes('application/json')) body = await res.json();
  else body = await res.text();

  // те, що повернемо, стане result у таску
  return { ok: res.ok, status: res.status, headers, body };
};


// === wrap.js (у репозиторії) ===
const https = require("https");
const http  = require("http");

function fetchText(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(url, { method: "GET", headers }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        let raw = Buffer.concat(chunks).toString("utf8");
        if (raw && raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
        resolve({ raw, status: res.statusCode, content_type: res.headers["content-type"] || "" });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

async function handle(event, context) {
  const url = event?.url;
  const headers = event?.headers || { "Accept": "text/plain" };
  if (!url) return { error: "Missing 'url' in event" };
  return await fetchText(url, headers);
}

module.exports = { handle };
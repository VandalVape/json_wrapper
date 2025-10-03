// wrap.js
const https = require("https");
const http  = require("http");

function fetchText(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const lib = url?.startsWith("https") ? https : http;
    const req = lib.request(url, { method: "GET", headers }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        let raw = Buffer.concat(chunks).toString("utf8");
        if (raw && raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // зняти BOM
        resolve({ raw, status: res.statusCode, content_type: res.headers["content-type"] || "" });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

// ОБОВ'ЯЗКОВО: експорт функції-обробника
async function handle(event, context) {
  const url = event?.url;
  const headers = event?.headers || { "Accept": "text/plain" };
  if (!url) return { error: "Missing 'url' in event" };
  return await fetchText(url, headers);
}

module.exports = { handle };

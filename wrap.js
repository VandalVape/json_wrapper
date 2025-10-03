// wrap.js
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
        // прибрати BOM на випадок CSV/Excel-експорту
        if (raw && raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
        resolve({
          raw,
          status: res.statusCode,
          content_type: res.headers["content-type"] || ""
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

// === ОБОВʼЯЗКОВО: експорт функції 'handle' ===
// Git Call викликає саме її і чекає, що ти ПОВЕРНЕШ JSON (return)
async function handle(event, context) {
  try {
    const url = event?.url;
    const headers = event?.headers || { "Accept": "text/plain" };
    if (!url) return { error: "Missing 'url' in event" };

    const out = await fetchText(url, headers);
    return out; // { raw, status, content_type }
  } catch (e) {
    // поверни помилку JSON-ом, без console.log — щоб не зламати JSON-відповідь
    return { error: String(e) };
  }
}

module.exports = { handle };

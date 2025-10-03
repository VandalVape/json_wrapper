const https = require("https");
const http  = require("http");

function fetchText(url, headers={}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.request(url, { method: "GET", headers }, (res) => {
      let buf = [];
      res.on("data", (c) => buf.push(c));
      res.on("end", () => {
        const raw = Buffer.concat(buf).toString("utf8");
        resolve({ raw, status: res.statusCode, content_type: res.headers["content-type"] || "" });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

(async () => {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const event = JSON.parse(Buffer.concat(chunks).toString("utf8"));

  const { url, headers } = event;
  const out = await fetchText(url, headers || {});
  process.stdout.write(JSON.stringify(out));
})().catch(e => {
  process.stdout.write(JSON.stringify({ error: String(e) }));
});

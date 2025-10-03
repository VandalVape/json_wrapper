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

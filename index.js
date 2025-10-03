const fetch = require('node-fetch');

module.exports = async (data = {}) => {
  const url = typeof data.url === 'string' ? data.url.trim() : '';
  if (!url) {
    // будь-яка помилка, що вилітає звідси, піде в помилку вузла Git Call
    throw new Error('Missing or invalid "url" parameter');
  }

  const res = await fetch(url, { redirect: 'follow' });

  // зібрати headers в простий обʼєкт
  const headers = {};
  res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });

  // спробувати розпізнати JSON, інакше — як текст
  let body;
  const ct = (headers['content-type'] || '').toLowerCase();
  if (ct.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  // усе, що повернемо — Corezoid запише в result
  return {
    ok: res.ok,
    status: res.status,
    headers,
    body
  };
};

// Glacier download-click counter — Cloudflare Worker
// Bind a KV namespace named COUNTS to this Worker (see setup steps).

const ALLOWED_ORIGINS = [
  'https://glacierclient.xyz',
  'https://www.glacierclient.xyz',
];

const KEY_RE = /^v[0-9.]{1,10}$/;

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(data, request, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');

    // GET /counts -> { "v6.2": 37, ... }
    if (request.method === 'GET' && path === '/counts') {
      const out = {};
      const list = await env.COUNTS.list();
      for (const k of list.keys) {
        const v = await env.COUNTS.get(k.name);
        out[k.name] = Number(v) || 0;
      }
      return json(out, request);
    }

    // POST /increment/:key -> { count: 38 }
    if (request.method === 'POST' && path.startsWith('/increment/')) {
      const key = decodeURIComponent(path.slice('/increment/'.length));
      if (!KEY_RE.test(key)) return json({ error: 'invalid key' }, request, 400);
      const current = Number(await env.COUNTS.get(key)) || 0;
      const next = current + 1;
      await env.COUNTS.put(key, String(next));
      return json({ count: next }, request);
    }

    return json({ error: 'not found' }, request, 404);
  },
};

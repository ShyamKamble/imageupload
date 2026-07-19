// Proxy POST /api/delete-image -> FastAPI backend /api/delete-image
export async function POST(request) {
  try {
    const backend = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
    const url = backend + '/api/delete-image';

    const headers = {};
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;

    // preserve incoming body
    const body = await request.text();
    if (!body) return new Response('Invalid body', { status: 400 });

    headers['content-type'] = request.headers.get('content-type') || 'application/json';

    const res = await fetch(url, { method: 'POST', headers, body, cache: 'no-store' });
    const contentType = res.headers.get('content-type') || 'text/plain';
    const text = await res.text();

    return new Response(text, { status: res.status, headers: { 'Content-Type': contentType } });
  } catch (err) {
    console.error('Proxy /api/delete-image error', err);
    return new Response('Internal server error', { status: 500 });
  }
}

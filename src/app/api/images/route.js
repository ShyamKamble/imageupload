// Proxy GET /api/images -> FastAPI backend /api/images
export async function GET(request) {
  try {
    const backend = (process.env.BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
    const url = backend + '/api/images';

    const headers = {};
    const auth = request.headers.get('authorization');
    if (auth) headers['authorization'] = auth;

    const res = await fetch(url, { method: 'GET', headers, cache: 'no-store' });
    const contentType = res.headers.get('content-type') || 'application/json';
    const body = await res.text();

    return new Response(body, { status: res.status, headers: { 'Content-Type': contentType } });
  } catch (err) {
    console.error('Proxy /api/images error', err);
    return new Response('Internal server error', { status: 500 });
  }
}

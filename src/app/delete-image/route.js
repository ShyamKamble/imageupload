// app/api/delete-image/route.js
import { getAuth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '../../../lib/superbaseClient';

export async function POST(request) {
  const { userId, getToken } = getAuth(request);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const userToken = await getToken();

  const supabase = getSupabaseClient(userToken);
  const body = await request.json();
  const { fullPath } = body;
  if (!fullPath || typeof fullPath !== "string") {
    return new Response("Invalid fullPath", { status: 400 });
  }

  // Let RLS enforce this, but you can add user-side check as well
  if (!fullPath.startsWith(`${userId}/`)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { error } = await supabase.storage.from("firstproject").remove([fullPath]);
  if (error) {
    return new Response("Error deleting file", { status: 500 });
  }

  return new Response("Deleted", { status: 200 });
}

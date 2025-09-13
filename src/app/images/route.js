// app/api/images/route.js
import { getAuth } from '@clerk/nextjs/server';
import { getSupabaseClient } from '../../../lib/superbaseClient'; // As above

export async function GET(request) {
  const { userId, sessionId, getToken } = getAuth(request);
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const userToken = await getToken(); // Clerk session JWT
  const supabase = getSupabaseClient(userToken);

  try {
    const { data: files, error } = await supabase.storage
      .from("firstproject")
      .list(userId, { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      console.error("Supabase list error:", error);
      return new Response("Error listing files", { status: 500 });
    }

    const filesWithUrls = await Promise.all(
      (files || []).map(async (f) => {
        const fullPath = `${userId}/${f.name}`;
        const { data: signed, error: signedErr } = await supabase.storage
          .from("firstproject")
          .createSignedUrl(fullPath, 60 * 60);

        if (signedErr) return null;
        return { name: f.name, fullPath, url: signed.signedUrl };
      })
    );

    return new Response(JSON.stringify(filesWithUrls.filter(Boolean)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Internal server error", { status: 500 });
  }
}

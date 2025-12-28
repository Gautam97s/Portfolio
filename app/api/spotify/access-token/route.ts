import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim().replace(/^["']|["']$/g, '');
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim().replace(/^["']|["']$/g, '');
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim().replace(/^["']|["']$/g, '');

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("Missing Spotify credentials:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRefreshToken: !!refreshToken,
    });
    return NextResponse.json(
      { error: "token_error", message: "Missing required Spotify credentials" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spotify token refresh failed:", response.status, errorText);
      return NextResponse.json(
        { error: "token_error", message: "Failed to refresh token", details: errorText },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ access_token: data.access_token });
  } catch (error) {
    console.error("Spotify token error:", error);
    return NextResponse.json(
      { error: "token_error" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  uri: string;
  previewUrl?: string | null;
  isPlaying: boolean;
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim().replace(/^["']|["']$/g, '');
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim().replace(/^["']|["']$/g, '');
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim().replace(/^["']|["']$/g, '');

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("Missing Spotify credentials in now-playing route");
    return null;
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
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    return null;
  }
}

async function getCurrentlyPlaying(accessToken: string): Promise<SpotifyTrack | null> {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204 || !response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.item) {
      return null;
    }

    const track = data.item;
    return {
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      albumImageUrl: track.album.images[0]?.url || "",
      songUrl: track.external_urls.spotify,
      uri: track.uri,
      previewUrl: track.preview_url ?? null,
      isPlaying: data.is_playing || false,
    };
  } catch (error) {
    return null;
  }
}

async function getRecentlyPlayed(accessToken: string): Promise<SpotifyTrack | null> {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const track = data.items[0].track;
    return {
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      album: track.album.name,
      albumImageUrl: track.album.images[0]?.url || "",
      songUrl: track.external_urls.spotify,
      uri: track.uri,
      previewUrl: track.preview_url ?? null,
      isPlaying: false,
    };
  } catch (error) {
    return null;
  }
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
    }

    // Try to get currently playing track
    let track = await getCurrentlyPlaying(accessToken);

    // If nothing is playing, get recently played
    if (!track) {
      track = await getRecentlyPlayed(accessToken);
    }

    if (!track) {
      return NextResponse.json({ error: "No track data available" }, { status: 404 });
    }

    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


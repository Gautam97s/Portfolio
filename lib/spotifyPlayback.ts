/**
 * Helper functions for Spotify Web Playback SDK
 */

export async function startPlayback(deviceId: string, uri: string): Promise<boolean> {
  try {
    // Get fresh access token
    const tokenResponse = await fetch("/api/spotify/access-token");
    if (!tokenResponse.ok) {
      return false;
    }

    const { access_token } = await tokenResponse.json();
    if (!access_token) {
      return false;
    }

    // Helper to transfer playback to our device
    const transfer = async (): Promise<boolean> => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: false, // Don't auto-play on transfer
          }),
        });
        
        // 204 = success, 404 = no active device (this is expected when browser is the first device)
        return res.status === 204 || res.status === 404;
      } catch {
        return false;
      }
    };

    // Helper to play track
    const play = async (): Promise<boolean> => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        });
        
        // 204 = success
        if (res.status === 204) {
          return true;
        }
        
        // If 404, device might not be registered yet
        if (res.status === 404) {
          return false;
        }
        
        // Check error message
        try {
          const errorData = await res.json();
          // NO_ACTIVE_DEVICE means we need to wait longer
          if (errorData?.error?.reason === "NO_ACTIVE_DEVICE") {
            return false;
          }
        } catch {
          // Couldn't parse error, assume failure
        }
        
        return false;
      } catch {
        return false;
      }
    };

    // Step 1: Transfer playback to our device
    // This registers the browser as an active device
    await transfer();

    // Step 2: Wait for Spotify to fully register the device
    // Premium users: browser can be a device, but it needs time to register
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Step 3: Attempt playback
    let playbackStarted = await play();
    
    // Step 4: If failed, retry with longer delay (device might still be registering)
    if (!playbackStarted) {
      // Transfer again to ensure device is active
      await transfer();
      // Wait longer for device registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      playbackStarted = await play();
    }

    return playbackStarted;
  } catch (error) {
    // Silently fail - will fall back to preview audio
    return false;
  }
}


"use client";

import { useState, useEffect, useRef } from "react";

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (state: any) => void) => void;
  removeListener: (event: string, callback: (state: any) => void) => void;
  getCurrentState: () => Promise<any>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
}

interface SpotifySDK {
  Player: new (config: {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }) => SpotifyPlayer;
}

declare global {
  interface Window {
    Spotify: SpotifySDK;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export function useSpotifyPlayer() {
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const scriptLoadedRef = useRef(false);
  const playerRef = useRef<SpotifyPlayer | null>(null);

  useEffect(() => {
    // Only load script once
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Check if script already exists
    if (document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]')) {
      if (window.Spotify) {
        initializePlayer();
      } else {
        window.onSpotifyWebPlaybackSDKReady = initializePlayer;
      }
      return;
    }

    // Set up callback before loading script
    window.onSpotifyWebPlaybackSDKReady = initializePlayer;

    // Load Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: disconnect player on unmount
      if (playerRef.current) {
        try {
          playerRef.current.disconnect();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const initializePlayer = async () => {
    if (!window.Spotify) {
      console.warn("Spotify SDK not available");
      return;
    }

    try {
      const tokenResponse = await fetch("/api/spotify/access-token");
      if (!tokenResponse.ok) {
        console.warn("Failed to get access token for player");
        return;
      }

      const { access_token } = await tokenResponse.json();
      if (!access_token) {
        console.warn("No access token received");
        return;
      }

      const spotifyPlayer = new window.Spotify.Player({
        name: "Portfolio Web Player",
        getOAuthToken: async (cb) => {
          try {
            const response = await fetch("/api/spotify/access-token");
            if (response.ok) {
              const data = await response.json();
              cb(data.access_token);
            }
          } catch (error) {
            console.error("Error getting OAuth token:", error);
          }
        },
        volume: 0.5,
      });

      // Set up event listeners
      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        setIsReady(true);
        setPlayer(spotifyPlayer);
        playerRef.current = spotifyPlayer;
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        setIsReady(false);
        setDeviceId(null);
      });

      // Connect to player
      const connected = await spotifyPlayer.connect();
      if (!connected) {
        console.warn("Failed to connect to Spotify player");
      }
    } catch (error) {
      console.error("Error initializing Spotify player:", error);
    }
  };

  return {
    player,
    deviceId,
    isReady,
  };
}


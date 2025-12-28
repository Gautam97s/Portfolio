"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Music } from "lucide-react";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { startPlayback } from "@/lib/spotifyPlayback";

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

export const SpotifyCard: React.FC = () => {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceReady, setDeviceReady] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const { player, deviceId, isReady } = useSpotifyPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Wait a bit after isReady becomes true to ensure device is fully registered
  useEffect(() => {
    if (isReady && deviceId) {
      // Give Spotify servers time to register the device
      const timer = setTimeout(() => {
        setDeviceReady(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setDeviceReady(false);
    }
  }, [isReady, deviceId]);

  const fetchTrack = async () => {
    try {
      if (!hasLoadedOnce) {
        setIsLoading(true);
      }
      setError(null);
      const response = await fetch("/api/spotify/now-playing");
      
      if (!response.ok) {
        throw new Error("Failed to fetch track");
      }

      const data = await response.json();
      setTrack(data);
      setIsPlaying(!!data?.isPlaying);
      setHasLoadedOnce(true);
    } catch (err) {
      setError("Unable to load track");
      // Keep previous track if it exists to avoid flicker
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
    
    // Only poll when tab is visible, reduce frequency to 30 seconds
    let interval: NodeJS.Timeout | null = null;
    
    const startPolling = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(fetchTrack, 30000); // Refresh every 30 seconds
    };
    
    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
    
    // Start polling
    startPolling();
    
    // Pause polling when tab is hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchTrack(); // Fetch immediately when tab becomes visible
        startPolling();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Listen to player state changes
  useEffect(() => {
    if (!player) return;

    const updatePlayerState = (state: any) => {
      if (state) {
        setIsPlaying(!state.paused);
        setPositionMs(state.position ?? 0);
        setDurationMs(state.duration ?? 0);
      }
    };

    player.addListener("player_state_changed", updatePlayerState);

    return () => {
      player.removeListener("player_state_changed", updatePlayerState);
    };
  }, [player]);

  // Sync local isPlaying with track when it changes
  useEffect(() => {
    if (track) {
      setIsPlaying(!!track.isPlaying);
    }
  }, [track]);

  // Track progress for preview audio fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPositionMs(Math.floor((audio.currentTime || 0) * 1000));
      setDurationMs(Math.floor((audio.duration || 0) * 1000));
    };

    const handleLoaded = () => {
      setDurationMs(Math.floor((audio.duration || 0) * 1000));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
    };
  }, [audioRef.current]);

  // Optional: gently advance progress using SDK state while playing
  useEffect(() => {
    if (!isPlaying || !durationMs) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setPositionMs((prev) => Math.min(prev + 500, durationMs));
    }, 500);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isPlaying, durationMs]);

  const formatTime = (ms: number) => {
    if (!ms || Number.isNaN(ms)) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-8 md:px-12 max-w-4xl">
          <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-900/50 shadow-sm">
            <div className="flex items-center gap-4">
              {/* Skeleton for album cover */}
              <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse flex-shrink-0" />
              
              {/* Skeleton for text */}
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
              </div>
              
              {/* Skeleton for play button */}
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse flex-shrink-0" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleTogglePlay = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!track) return;

    // Prefer Web Playback SDK when available
    if (canUseWebPlayback && player && deviceId) {
      try {
        if (isPlaying) {
          // Pause playback
          await player.pause();
          setIsPlaying(false);
          return;
        }

        // Check if the same track is already loaded and paused
        try {
          const state = await player.getCurrentState();
          if (state) {
            const currentTrack = state.track_window.current_track;
            // If same track is paused, resume it instead of restarting
            if (currentTrack && currentTrack.uri === track.uri && state.paused) {
              await player.resume();
              setIsPlaying(true);
              return;
            }
          }
        } catch {
          // If we can't get state, proceed to start playback
        }

        // Start playback (either new track or no current state)
        const success = await startPlayback(deviceId, track.uri);
        if (success) {
          setIsPlaying(true);
        }
        return;
      } catch (error) {
        console.error("Playback failed:", error);
        // fall through to preview if available
      }
    }

    // Fallback to 30s preview if available
    if (track.previewUrl) {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio(track.previewUrl);
          audioRef.current.addEventListener("ended", () => setIsPlaying(false));
        }

        const audio = audioRef.current;

        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          // if URL changed, reset src
          if (audio.src !== track.previewUrl) {
            audio.src = track.previewUrl;
          }
          await audio.play();
          setIsPlaying(true);
        }
        return;
      } catch (err) {
        console.error("Preview playback failed:", err);
      }
    }
  };

  const canUseWebPlayback = deviceReady && deviceId && track?.uri && player;
  const hasPreview = !!track?.previewUrl;
  const isActionDisabled = !track || (!canUseWebPlayback && !hasPreview);
  const progressPercent =
    durationMs > 0 ? Math.min(100, (positionMs / durationMs) * 100) : 0;
  
  // Only show progress card when music is playing through our web player or preview audio
  const isPlayingLocally =
    isPlaying &&
    ((player && durationMs > 0) || (hasPreview && audioRef.current && !audioRef.current.paused));

  if (error || !track) {
    return null; // Don't show anything if there's an error
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-8 md:px-12 max-w-4xl">
        <div className="relative">
          {/* Base card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-100 dark:border-slate-900/50 shadow-sm hover:border-accent/50 dark:hover:border-primary/50 transition-colors relative z-10">
            <div className="flex items-center gap-4">
            {/* Album Cover */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800">
              {track.albumImageUrl ? (
                <img
                  src={track.albumImageUrl}
                  alt={`${track.title} by ${track.artist}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music size={24} className="text-slate-400 dark:text-slate-600" />
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-accent dark:text-primary">
                  {track.isPlaying ? "Now Playing" : "Last Played"}
                </span>
                {track.isPlaying && (
                  <span className="w-2 h-2 rounded-full bg-accent dark:bg-primary animate-pulse" />
                )}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {track.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {track.artist}
              </p>
            </div>

            {/* Control (toggle play/pause) */}
            <button
              onClick={handleTogglePlay}
              disabled={isActionDisabled}
              className={`w-10 h-10 rounded-full bg-dark hover:bg-dark/80 dark:bg-primary/10 dark:hover:bg-primary/20 flex items-center justify-center transition-colors flex-shrink-0 group ${
                isActionDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
              aria-label={
                canUseWebPlayback
                  ? isPlaying
                    ? `Pause ${track.title}`
                    : `Play ${track.title} in browser`
                  : `Open ${track.title} on Spotify`
              }
            >
              {isPlayingLocally ? (
                <Pause
                  size={18}
                  className={`text-accent dark:text-primary transition-transform ${
                    !isActionDisabled ? "group-hover:scale-110" : ""
                  }`}
                  strokeWidth={2.5}
                />
              ) : (
                <Play
                  size={18}
                  className={`text-accent dark:text-primary ml-0.5 transition-transform ${
                    !isActionDisabled ? "group-hover:scale-110" : ""
                  }`}
                  fill="currentColor"
                />
              )}
            </button>
          </div>
        </div>

          {/* Sliding player overlay - only show when playing locally */}
          <div
            className={`absolute left-3 right-3 mt-2 transition-all duration-300 ${
              isPlayingLocally
                ? "translate-y-4 opacity-100"
                : "translate-y-0 opacity-0 pointer-events-none"
            }`}
          >
            <div className="rounded-xl bg-white border border-slate-200 hover:border-accent/50 dark:hover:border-primary/50 shadow-xl shadow-slate-300/40 px-4 py-3 dark:bg-dark/85 dark:border-slate-900/60 dark:shadow-black/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-10 tabular-nums">
                  {formatTime(positionMs)}
                </span>

                <div className="relative flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-accent/70 dark:bg-primary"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-10 text-right tabular-nums">
                  {formatTime(durationMs)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


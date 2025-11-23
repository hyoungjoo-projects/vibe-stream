import { createContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { SongWithArtist } from '@/types/song';

interface PlayerContextType {
  currentSong: SongWithArtist | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (song: SongWithArtist) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<SongWithArtist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playSong = (song: SongWithArtist) => {
    if (audioRef.current) {
      if (currentSong?.id === song.id && !audioRef.current.paused) {
        return;
      }

      audioRef.current.src = song.audio_url;
      audioRef.current.play().catch((error) => {
        console.error('Failed to play audio:', error);
      });
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeSong = () => {
    if (audioRef.current && currentSong) {
      audioRef.current.play().catch((error) => {
        console.error('Failed to resume audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        playSong,
        pauseSong,
        resumeSong,
        togglePlayPause,
        setVolume,
        seekTo,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

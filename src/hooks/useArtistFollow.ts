import { useState, useEffect } from 'react';

const ARTIST_FOLLOWS_KEY = 'vibe-stream-artist-follows';

export const useArtistFollow = () => {
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ARTIST_FOLLOWS_KEY);
    if (stored) {
      try {
        setFollowedIds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse artist follows from localStorage', e);
      }
    }
  }, []);

  const followArtist = (artistId: string) => {
    setFollowedIds((prev) => {
      if (prev.includes(artistId)) return prev;
      const updated = [...prev, artistId];
      localStorage.setItem(ARTIST_FOLLOWS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const unfollowArtist = (artistId: string) => {
    setFollowedIds((prev) => {
      const updated = prev.filter((id) => id !== artistId);
      localStorage.setItem(ARTIST_FOLLOWS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isFollowing = (artistId: string) => {
    return followedIds.includes(artistId);
  };

  const toggleFollow = (artistId: string) => {
    if (isFollowing(artistId)) {
      unfollowArtist(artistId);
      return false;
    } else {
      followArtist(artistId);
      return true;
    }
  };

  return { followedIds, followArtist, unfollowArtist, isFollowing, toggleFollow };
};

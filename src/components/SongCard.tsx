import { useState } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SongWithArtist } from '@/types/song';
import { usePlayer } from '@/hooks/usePlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from 'sonner';

interface SongCardProps {
  song: SongWithArtist;
}

export const SongCard = ({ song }: SongCardProps) => {
  const { currentSong, isPlaying, playSong, pauseSong } = usePlayer();
  const { isFavorite, addToFavorite, removeFromFavorite } = useFavorites();

  const [isHovered, setIsHovered] = useState(false);
  const isCurrentSong = currentSong?.id === song.id;
  const isSongFavorite = isFavorite(song.id);

  const handlePlayPause = () => {
    if (isCurrentSong && isPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSongFavorite) {
      removeFromFavorite(song.id);
      toast.success('즐겨찾기에서 제거되었습니다');
    } else {
      addToFavorite(song.id);
      toast.success('즐겨찾기에 추가되었습니다');
    }
  };

  return (
    <Card
      className="group relative w-64 overflow-hidden border-border bg-background transition-all duration-300 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {song.image_url && (
          <img
            src={song.image_url}
            alt={song.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex h-full items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePlayPause}
              className={`h-16 w-16 rounded-full bg-white text-black transition-all duration-300 hover:bg-white hover:scale-110 ${
                isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
              }`}
            >
              {isCurrentSong && isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current" />
              )}
            </Button>
          </div>
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleFavorite}
          className={`absolute right-2 top-2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-300 hover:bg-background ${
            isHovered ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-300 ${
              isSongFavorite
                ? 'fill-red-500 text-red-500'
                : 'fill-none text-foreground'
            }`}
          />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-foreground">
          {song.title}
        </h3>
        <p className="truncate text-sm text-muted-foreground">{song.artist.name}</p>
      </div>
    </Card>
  );
};
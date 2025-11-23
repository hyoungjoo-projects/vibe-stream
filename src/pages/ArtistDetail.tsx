import { useParams } from 'react-router-dom';
import { Music, Play, Pause, Heart, MoreVertical, Share2, ListPlus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SongCard } from '@/components/SongCard';
import { useArtist } from '@/hooks/useArtists';
import { useSongs } from '@/hooks/useSongs';
import { usePlayer } from '@/hooks/usePlayer';
import { useArtistFollow } from '@/hooks/useArtistFollow';
import { toast } from 'sonner';

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: artist, isLoading: artistLoading } = useArtist(id!);
  const { data: songs, isLoading: songsLoading } = useSongs(id);
  const { playSong, pauseSong, resumeSong, currentSong, isPlaying } = usePlayer();
  const { isFollowing, toggleFollow } = useArtistFollow();

  const isLoading = artistLoading || songsLoading;

  // 현재 이 아티스트의 곡이 재생 중인지 확인
  const isArtistPlaying = currentSong?.artist_id === id && isPlaying;

  // 현재 아티스트를 팔로우 중인지 확인
  const isArtistFollowing = id ? isFollowing(id) : false;

  const handlePlayPause = () => {
    if (songs && songs.length > 0) {
      // 이 아티스트의 곡이 재생 중이면 일시정지
      if (isArtistPlaying) {
        pauseSong();
      } else {
        // 현재 곡이 이 아티스트의 곡이면 재개, 아니면 첫 번째 곡 재생
        if (currentSong?.artist_id === id) {
          resumeSong();
        } else {
          playSong(songs[0]);
          toast.success(`${artist?.name}의 곡 재생을 시작합니다`);
        }
      }
    } else {
      toast.error('재생할 곡이 없습니다');
    }
  };

  const handleFollow = () => {
    if (!id) return;

    const nowFollowing = toggleFollow(id);
    if (nowFollowing) {
      toast.success(`${artist?.name}을(를) 팔로우했습니다`);
    } else {
      toast.info(`${artist?.name} 팔로우를 취소했습니다`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 pb-32">
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Skeleton className="w-64 h-64 rounded-lg" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            아티스트를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground">
            요청하신 아티스트 정보를 불러올 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pb-32">
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              {artist.image_url ? (
                <div className="relative">
                  <img
                    src={artist.image_url}
                    alt={artist.name}
                    className="w-64 h-64 object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-2xl">
                  <Music className="w-24 h-24 text-primary/40" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                <Music className="w-6 h-6" />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">
                  아티스트
                </Badge>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  {artist.name}
                </h1>
              </div>

              {artist.profile && (
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {artist.profile}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="gap-2" onClick={handlePlayPause}>
                  {isArtistPlaying ? (
                    <>
                      <Pause className="w-5 h-5" fill="currentColor" />
                      일시정지
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" fill="currentColor" />
                      재생
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant={isArtistFollowing ? "default" : "outline"}
                  className="gap-2"
                  onClick={handleFollow}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isArtistFollowing ? "currentColor" : "none"}
                  />
                  {isArtistFollowing ? "팔로잉" : "팔로우"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="lg" variant="outline">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('링크가 복사되었습니다');
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      공유하기
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.info('플레이리스트에 추가 기능은 준비 중입니다');
                      }}
                    >
                      <ListPlus className="w-4 h-4 mr-2" />
                      플레이리스트에 추가
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">곡 목록</h2>
            <Badge variant="secondary" className="text-sm">
              {songs?.length || 0}곡
            </Badge>
          </div>

          {songs && songs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card border-border">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">
                등록된 곡이 없습니다.
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

export default ArtistDetail;
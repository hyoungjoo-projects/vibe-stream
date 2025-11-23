import { Heart, Music, User } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useSongsByIds } from '@/hooks/useSongs';
import { useArtistFollow } from '@/hooks/useArtistFollow';
import { useArtistsByIds } from '@/hooks/useArtists';
import { SongCard } from '@/components/SongCard';
import { ArtistCard } from '@/components/ArtistCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const Favorite = () => {
  const { favoriteIds } = useFavorites();
  const { followedIds } = useArtistFollow();
  const { data: songs, isLoading: songsLoading } = useSongsByIds(favoriteIds);
  const { data: artists, isLoading: artistsLoading } = useArtistsByIds(followedIds);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pb-32">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                즐겨찾기
              </h1>
              <p className="text-muted-foreground mt-2">
                팔로우한 아티스트와 좋아하는 곡들을 모아보세요
              </p>
            </div>
          </div>
        </div>

        {/* 팔로우한 아티스트 섹션 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6">팔로우한 아티스트</h2>
          {artistsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-border bg-card">
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square rounded-full mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : artists && artists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-border">
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                팔로우한 아티스트가 없습니다
              </h3>
              <p className="text-muted-foreground">
                좋아하는 아티스트를 팔로우해보세요!
              </p>
            </Card>
          )}
        </section>

        {/* 즐겨찾기 곡 섹션 */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6">즐겨찾기 곡</h2>
          {songsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-border bg-card">
                  <CardContent className="p-4">
                    <Skeleton className="aspect-square rounded-md mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : songs && songs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-border">
              <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                즐겨찾기 곡이 없습니다
              </h3>
              <p className="text-muted-foreground">
                마음에 드는 곡을 즐겨찾기에 추가해보세요!
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

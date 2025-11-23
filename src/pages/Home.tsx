import { Music, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArtistCard } from '@/components/ArtistCard';
import { SongCard } from '@/components/SongCard';
import { useArtists } from '@/hooks/useArtists';
import { useSongs } from '@/hooks/useSongs';

// Loading Skeleton Components
const ArtistCardSkeleton = () => (
  <Card className="overflow-hidden border-border bg-card">
    <CardContent className="p-4">
      <Skeleton className="aspect-square rounded-full mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </CardContent>
  </Card>
);

const SongCardSkeleton = () => (
  <Card className="overflow-hidden border-border bg-card">
    <CardContent className="p-4">
      <Skeleton className="aspect-square rounded-md mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-1" />
      <Skeleton className="h-3 w-1/3" />
    </CardContent>
  </Card>
);

// Main Component
const Home = () => {
  const { data: artists, isLoading: artistsLoading } = useArtists();
  const { data: allSongs, isLoading: songsLoading } = useSongs();

  // 최신곡 5개만 표시
  const songs = allSongs?.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-32">
        {/* Artists Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground">아티스트</h2>
          </div>
          {artistsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <ArtistCardSkeleton key={i} />
              ))}
            </div>
          ) : artists && artists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">등록된 아티스트가 없습니다.</p>
            </div>
          )}
        </section>

        {/* Songs Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground">최신 곡</h2>
          </div>
          {songsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <SongCardSkeleton key={i} />
              ))}
            </div>
          ) : songs && songs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">등록된 곡이 없습니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
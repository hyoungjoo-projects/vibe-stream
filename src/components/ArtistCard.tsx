import { Link } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Artist } from '@/types/artist';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  return (
    <Link to={`/artists/${artist.id}`}>
      <Card
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-border bg-card"
      >
        {artist.image_url && (
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={artist.image_url}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold text-foreground">
            {artist.name}
          </CardTitle>
          {artist.profile && (
            <CardDescription className="line-clamp-2 text-muted-foreground">
              {artist.profile}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
};
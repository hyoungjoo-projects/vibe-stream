import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Song, SongWithArtist } from '@/types/song';

export const useSongs = (artistId?: string) => {
  return useQuery({
    queryKey: ['songs', artistId],
    queryFn: async () => {
      let query = supabase
        .from('songs')
        .select(
          `
          *,
          artist:artists(*)
        `
        )
        .order('created_at', { ascending: false });

      if (artistId) {
        query = query.eq('artist_id', artistId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SongWithArtist[];
    },
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: ['song', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select(
          `
          *,
          artist:artists(*)
        `
        )
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as SongWithArtist;
    },
    enabled: !!id,
  });
};

export const useSongsByIds = (ids: string[]) => {
  return useQuery({
    queryKey: ['songs', 'by-ids', ids],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from('songs')
        .select(
          `
          *,
          artist:artists(*)
        `
        )
        .in('id', ids);
      if (error) throw error;
      return data as SongWithArtist[];
    },
    enabled: ids.length > 0,
  });
};

export const useCreateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (song: Omit<Song, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('songs')
        .insert(song)
        .select(
          `
          *,
          artist:artists(*)
        `
        )
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      queryClient.invalidateQueries({ queryKey: ['songs', data.artist_id] });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Song> & { id: string }) => {
      const { data, error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', id)
        .select(
          `
          *,
          artist:artists(*)
        `
        )
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      queryClient.invalidateQueries({ queryKey: ['song', data.id] });
      queryClient.invalidateQueries({ queryKey: ['songs', data.artist_id] });
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });
};

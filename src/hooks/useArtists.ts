import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Artist } from '@/types/artist';

export const useArtists = () => {
  return useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Artist[];
    },
  });
};

export const useArtist = (id: string) => {
  return useQuery({
    queryKey: ['artist', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Artist;
    },
    enabled: !!id,
  });
};

export const useArtistsByIds = (ids: string[]) => {
  return useQuery({
    queryKey: ['artists', 'by-ids', ids],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .in('id', ids);
      if (error) throw error;
      return data as Artist[];
    },
    enabled: ids.length > 0,
  });
};

export const useCreateArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artist: Omit<Artist, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('artists')
        .insert(artist)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
  });
};

export const useUpdateArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Artist> & { id: string }) => {
      const { data, error } = await supabase
        .from('artists')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['artist', data.id] });
    },
  });
};

export const useDeleteArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('artists').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
  });
};

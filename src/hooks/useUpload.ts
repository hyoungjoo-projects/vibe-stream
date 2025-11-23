import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useUploadArtistImage = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('artist-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('artist-images').getPublicUrl(filePath);

      return publicUrl;
    },
  });
};

export const useUploadSongImage = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('song-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('song-images').getPublicUrl(filePath);

      return publicUrl;
    },
  });
};

export const useUploadAudio = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('audio-files').getPublicUrl(filePath);

      return publicUrl;
    },
  });
};

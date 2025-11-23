import { useState } from "react";
import { useParams } from "react-router-dom";
import { Music, Plus, Edit, Trash2, Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useArtist } from "@/hooks/useArtists";
import { useSongs, useCreateSong, useUpdateSong, useDeleteSong } from "@/hooks/useSongs";
import { useUploadSongImage, useUploadAudio } from "@/hooks/useUpload";
import type { SongWithArtist } from "@/types/song";
import { toast } from "sonner";

export default function AdminSongManagement() {
  const { id: artistId } = useParams<{ id: string }>();
  const { data: artist } = useArtist(artistId!);
  const { data: songs } = useSongs(artistId);
  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();
  const uploadImage = useUploadSongImage();
  const uploadAudio = useUploadAudio();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<SongWithArtist | null>(null);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setImageFile(null);
    setAudioFile(null);
    setEditingSong(null);
    setImagePreview(null);
  };

  const handleOpenDialog = (song?: SongWithArtist) => {
    if (song) {
      setEditingSong(song);
      setTitle(song.title);
      setImagePreview(song.image_url);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(editingSong?.image_url || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingSong && !audioFile) {
      toast.error("음성 파일을 선택해주세요");
      return;
    }

    try {
      let imageUrl: string | null = editingSong?.image_url || null;
      let audioUrl: string | undefined = editingSong?.audio_url;

      if (imageFile) {
        imageUrl = await uploadImage.mutateAsync(imageFile);
      }

      if (audioFile) {
        audioUrl = await uploadAudio.mutateAsync(audioFile);
      }

      const songData = {
        title,
        artist_id: artistId!,
        image_url: imageUrl,
        audio_url: audioUrl!,
        duration: null,
      };

      if (editingSong) {
        await updateSong.mutateAsync({
          id: editingSong.id,
          ...songData,
        });
        toast.success("곡이 업데이트되었습니다");
      } else {
        await createSong.mutateAsync(songData);
        toast.success("곡이 추가되었습니다");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("작업 중 오류가 발생했습니다");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("이 곡을 삭제하시겠습니까?")) {
      try {
        await deleteSong.mutateAsync(id);
        toast.success("곡이 삭제되었습니다");
      } catch (error) {
        toast.error("삭제 중 오류가 발생했습니다");
      }
    }
  };

  const isUploading = createSong.isPending || updateSong.isPending || uploadImage.isPending || uploadAudio.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">곡 관리</h1>
          </div>
          <p className="text-muted-foreground">
            아티스트: <span className="font-medium text-foreground">{artist?.name || '로딩 중...'}</span>
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            총 <span className="font-semibold text-foreground">{songs?.length || 0}</span>개의 곡
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="w-4 h-4" />
                신규 곡 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingSong ? "곡 편집" : "신규 곡 추가"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    곡명
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="곡 제목을 입력하세요"
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audio" className="text-sm font-medium">
                    음성 파일 {!editingSong && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="audio"
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      required={!editingSong}
                      className="h-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {audioFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      선택된 파일: {audioFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    앨범 아트
                  </Label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-1 right-1 p-1 bg-destructive/90 hover:bg-destructive rounded-full transition-colors"
                        >
                          <X className="w-3 h-3 text-destructive-foreground" />
                        </button>
                      </div>
                    )}
                    <div className="relative">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="h-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
                      />
                      <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-10" disabled={isUploading}>
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      업로드 중...
                    </span>
                  ) : editingSong ? (
                    "업데이트"
                  ) : (
                    "추가"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px]">앨범 아트</TableHead>
                <TableHead>곡명</TableHead>
                <TableHead>아티스트</TableHead>
                <TableHead className="w-[300px]">오디오</TableHead>
                <TableHead className="w-[120px]">등록일</TableHead>
                <TableHead className="w-[100px] text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {songs && songs.length > 0 ? (
                songs.map((song) => (
                  <TableRow key={song.id} className="group">
                    <TableCell>
                      {song.image_url ? (
                        <img
                          src={song.image_url}
                          alt={song.title}
                          className="w-12 h-12 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border">
                          <Music className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{song.title}</TableCell>
                    <TableCell className="text-muted-foreground">{song.artist.name}</TableCell>
                    <TableCell>
                      {song.audio_url ? (
                        <audio controls className="h-8 w-full max-w-[280px]">
                          <source src={song.audio_url} />
                          브라우저가 오디오를 지원하지 않습니다.
                        </audio>
                      ) : (
                        <span className="text-muted-foreground text-sm">No Audio</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(song.created_at).toLocaleDateString("ko-KR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog(song)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(song.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Music className="w-12 h-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground">등록된 곡이 없습니다</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
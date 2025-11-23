import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Music, Trash2 } from 'lucide-react';
import { useArtists, useCreateArtist, useUpdateArtist, useDeleteArtist } from '@/hooks/useArtists';
import { useUploadArtistImage } from '@/hooks/useUpload';
import type { Artist } from '@/types/artist';
import { toast } from 'sonner';

const ArtistManagement = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: artists } = useArtists();
  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();
  const deleteArtist = useDeleteArtist();
  const uploadImage = useUploadArtistImage();

  const resetForm = () => {
    setName('');
    setProfile('');
    setImageFile(null);
    setEditingArtist(null);
  };

  const handleOpenDialog = (artist?: Artist) => {
    if (artist) {
      setEditingArtist(artist);
      setName(artist.name);
      setProfile(artist.profile || '');
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl: string | null = editingArtist?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadImage.mutateAsync(imageFile);
      }

      const artistData = {
        name,
        profile: profile || null,
        image_url: imageUrl,
      };

      if (editingArtist) {
        await updateArtist.mutateAsync({
          id: editingArtist.id,
          ...artistData,
        });
        toast.success('아티스트가 업데이트되었습니다');
      } else {
        await createArtist.mutateAsync(artistData);
        toast.success('아티스트가 추가되었습니다');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('작업 중 오류가 발생했습니다');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`"${name}" 아티스트를 삭제하시겠습니까?\n\n관련된 모든 곡도 함께 삭제됩니다.`)) {
      try {
        await deleteArtist.mutateAsync(id);
        toast.success('아티스트가 삭제되었습니다');
      } catch (error) {
        toast.error('삭제 중 오류가 발생했습니다');
      }
    }
  };

  const isUploading = createArtist.isPending || updateArtist.isPending || uploadImage.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">아티스트 관리</h1>
            <p className="text-muted-foreground">아티스트 정보를 관리하고 곡을 추가할 수 있습니다</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                신규 아티스트 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingArtist ? '아티스트 편집' : '신규 아티스트 추가'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    아티스트명 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="아티스트 이름을 입력하세요"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile" className="text-sm font-medium">
                    프로필
                  </Label>
                  <Textarea
                    id="profile"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    placeholder="아티스트 소개를 입력하세요"
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    이미지
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="h-11 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG 형식의 이미지를 업로드하세요
                  </p>
                </div>
                <Button type="submit" className="w-full h-11" disabled={isUploading}>
                  {isUploading ? '업로드 중...' : editingArtist ? '업데이트' : '추가'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-border rounded-lg bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20">이미지</TableHead>
                <TableHead className="font-semibold">아티스트명</TableHead>
                <TableHead className="font-semibold">프로필</TableHead>
                <TableHead className="w-32 font-semibold">등록일</TableHead>
                <TableHead className="w-48 font-semibold text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists && artists.length > 0 ? (
                artists.map((artist) => (
                  <TableRow key={artist.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      {artist.image_url ? (
                        <img
                          src={artist.image_url}
                          alt={artist.name}
                          className="w-12 h-12 object-cover rounded-md border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center border border-border">
                          <Music className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{artist.name}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {artist.profile || '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(artist.created_at).toLocaleDateString('ko-KR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(artist)}
                          className="gap-1.5"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          편집
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => navigate(`/admin/artists/${artist.id}/songs`)}
                        >
                          <Music className="w-3.5 h-3.5" />
                          곡 관리
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(artist.id, artist.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Music className="w-12 h-12 text-muted-foreground/50" />
                      <p>등록된 아티스트가 없습니다</p>
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
};

export default ArtistManagement;
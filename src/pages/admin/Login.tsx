import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      toast.success('로그인 성공');

      // 관리자면 관리자 페이지로, 일반 유저면 홈으로
      const isAdmin = data?.user?.user_metadata?.is_admin ?? false;
      navigate(isAdmin ? '/admin/artists' : '/');
    } catch (error) {
      toast.error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section id="hero" className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur">
          <CardHeader className="space-y-3 text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-600 flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              로그인
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400">
              Vibe Stream에 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  이메일
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  비밀번호
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-11 border-slate-300 dark:border-slate-700 focus:border-slate-500 dark:focus:border-slate-500"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 dark:from-slate-600 dark:to-slate-800 dark:hover:from-slate-700 dark:hover:to-slate-900 text-white font-medium shadow-lg transition-all duration-200" 
                disabled={loading}
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-background/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-200">
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-background border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">보안 인증</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">안전한 인증 시스템</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-background border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Mail className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">이메일 인증</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">이메일 기반 로그인</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-background border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">암호화</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">강력한 비밀번호 보호</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">
            문의하기
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            로그인에 문제가 있으시거나 관리자 권한이 필요하신 경우 문의해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-slate-300 dark:border-slate-700">
              <Mail className="w-4 h-4 mr-2" />
              이메일 문의
            </Button>
            <Button variant="outline" className="border-slate-300 dark:border-slate-700">
              도움말 보기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLoginPage;
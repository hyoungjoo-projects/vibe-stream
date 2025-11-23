import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { PlayerWidget } from '@/components/PlayerWidget';
import Home from '@/pages/Home';
import ArtistDetail from '@/pages/ArtistDetail';
import { Favorite } from '@/pages/Favorite';
import Login from '@/pages/admin/Login';
import Artists from '@/pages/admin/Artists';
import Songs from '@/pages/admin/Songs';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="container mx-auto px-4 py-8">로딩 중...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/artists"
              element={
                <ProtectedRoute>
                  <Artists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/artists/:id/songs"
              element={
                <ProtectedRoute>
                  <Songs />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<Navigate to="/admin/artists" replace />} />
          </Routes>
        </main>
        <PlayerWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;

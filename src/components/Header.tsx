import { Link, useLocation } from 'react-router-dom';
import { Music2, Heart, Shield, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const activeLink = location.pathname;

  const handleSignOut = async () => {
    await signOut();
  };

  const navLinks = [
    { href: '/', label: '홈', icon: Music2 },
    { href: '/favorite', label: '즐겨찾기', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-all duration-300"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
              <Music2 className="w-5 h-5 text-primary group-hover:text-primary/90 transition-colors" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
              Vibe Stream
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {/* Main Navigation Links */}
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeLink === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                      transition-all duration-200 ease-in-out
                      ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Navigation */}
            <div className="flex sm:hidden items-center gap-1 mr-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeLink === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      flex items-center justify-center w-9 h-9 rounded-md
                      transition-all duration-200 ease-in-out
                      ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            {(user || !user) && (
              <Separator orientation="vertical" className="h-6 mx-1" />
            )}

            {/* Admin Section */}
            {user && isAdmin && (
              <>
                <Link
                  to="/admin/artists"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  <span>관리자</span>
                </Link>
                <Link
                  to="/admin/artists"
                  className="flex sm:hidden items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              </>
            )}

            {/* Logout Button - for all logged in users */}
            {user && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="hidden sm:flex items-center gap-2 border-border/50 hover:border-border hover:bg-accent"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSignOut}
                  className="flex sm:hidden w-9 h-9 border-border/50 hover:border-border hover:bg-accent"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Login Button */}
            {!user && (
              <>
                <Link to="/admin/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>로그인</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex sm:hidden w-9 h-9 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
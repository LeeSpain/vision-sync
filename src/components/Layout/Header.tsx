import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CurrencySelector } from '@/components/ui/currency-selector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '#projects' },
    { name: 'For Investors', href: '/for-investors' },
    { name: 'For Sale', href: '/for-sale' },
    { name: 'Custom Builds', href: '/custom-builds' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-white/95 backdrop-blur-sm border-b border-soft-lilac/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-heading font-bold text-midnight-navy">
              Vision-Sync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-royal-purple ${
                  location.pathname === item.href
                    ? 'text-royal-purple'
                    : 'text-midnight-navy/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <CurrencySelector variant="compact" />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-midnight-navy/80 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-soft-lilac/20">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-midnight-navy/80 hover:text-royal-purple transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mb-4">
                <CurrencySelector />
              </div>
              {user ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-midnight-navy/80 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={signOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
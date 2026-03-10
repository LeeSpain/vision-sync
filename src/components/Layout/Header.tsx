import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LocaleSelector } from '@/components/common/LocaleSelector';
import { useTranslation } from 'react-i18next';
import ShareButton from '@/components/ShareButton';
import HeaderChatButton from '@/components/chat/HeaderChatButton';
import AiChatWidget from '@/components/chat/AiChatWidget';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const navigation = [
    { name: t('header.platform'), href: '/platform' },
    { name: t('header.solutions'), href: '/solutions' },
    { name: t('header.modules'), href: '/modules' },
    { name: t('header.pricing'), href: '/pricing' },
    { name: t('header.contact'), href: '/contact' },
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

          {/* Chat Button - next to logo */}
          <HeaderChatButton onClick={() => setIsChatOpen(true)} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-royal-purple ${location.pathname === item.href
                  ? 'text-royal-purple'
                  : 'text-midnight-navy/80'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <ShareButton />
              <LocaleSelector variant="compact" />
              {user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      {t('header.dashboard')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-1" />
                    {t('header.signOut')}
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    {t('header.signIn')}
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
              <ShareButton fullWidth />
              <LocaleSelector className="w-full" />
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      {t('header.dashboard')}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={signOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-1" />
                    {t('header.signOut')}
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">
                    {t('header.signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Chat Widget - only renders when open */}
      {isChatOpen && (
        <AiChatWidget
          isMinimized={false}
          onToggleMinimize={() => setIsChatOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;

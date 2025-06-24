
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Menu, LogOut, User, Home, Users, BookOpen, ClipboardCheck, MessageSquare, Info } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userType = user?.user_metadata?.user_type || 'student';
  const firstName = user?.user_metadata?.first_name || 'User';

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
    setIsOpen(false);
  };

  const studentNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Find Counsellor', path: '/contact', icon: Users },
    { name: 'Self Assessment', path: '/assessment', icon: ClipboardCheck },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Blog', path: '/blog', icon: MessageSquare },
    { name: 'About', path: '/about', icon: Info },
  ];

  const counsellorNavItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Students', path: '/contact', icon: Users },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Blog', path: '/blog', icon: MessageSquare },
    { name: 'About', path: '/about', icon: Info },
  ];

  const navItems = userType === 'student' ? studentNavItems : counsellorNavItems;
  const profilePath = userType === 'student' ? '/student-profile' : '/counsellor-profile';

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mobile
                ? isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                : isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
          <img src="/ful.svg" alt="Logo" className="h-6 w-6 rounded-full" />
            <span className="text-xl font-bold">FULAFIA Counselling</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to={profilePath}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <User className="h-4 w-4" />
              {firstName}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-2 pb-6 border-b">
                    <Heart className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">FULAFIA Counselling</span>
                  </div>

                  {/* Mobile User Info */}
                  <div className="py-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{firstName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{userType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex-1 py-6 space-y-2">
                    <NavLinks mobile onItemClick={() => setIsOpen(false)} />
                  </div>

                  {/* Mobile Footer */}
                  <div className="border-t pt-6 space-y-2">
                    <Link
                      to={profilePath}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full justify-start"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

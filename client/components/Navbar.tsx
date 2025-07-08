import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach';
  hourlyRate: number;
}

interface Tab {
  name: string;
  href: string;
}

interface NavbarProps {
  user?: User;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | undefined>(user);

  useEffect(() => {
    if (!currentUser && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    } else {
      router.push('/login');
    }
  };

  const isActive = (path: string): boolean => router.pathname === path;

  if (!currentUser) return null;

  const adminTabs: Tab[] = [
    { name: 'Schedule', href: '/admin/schedule' },
    { name: 'Hours', href: '/admin/hours' },
    { name: 'Add Coach', href: '/admin/add-coach' },
    { name: 'Create Session', href: '/admin/create-session' }
  ];

  const coachTabs: Tab[] = [
    { name: 'Schedule', href: '/coach/schedule' },
    { name: 'Hours', href: '/coach/hours' }
  ];

  const tabs = currentUser.role === 'admin' ? adminTabs : coachTabs;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Tennis Academy
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href={tab.href}
                  className={`nav-link ${
                    isActive(tab.href) ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  {tab.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-700 mr-4">
                Welcome, {currentUser.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 
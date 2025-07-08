import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import SessionForm from '../../components/SessionForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach';
  hourlyRate: number;
}

interface Coach {
  _id: string;
  name: string;
  email: string;
  hourlyRate: number;
}

export default function CreateSession() {
  const [user, setUser] = useState<User | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const userObj: User = JSON.parse(userData);
    if (userObj.role !== 'admin') {
      router.push('/login');
      return;
    }

    setUser(userObj);
    fetchCoaches();
  }, [router]);

  const fetchCoaches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const coachUsers = data.filter((user: any) => user.role === 'coach');
        setCoaches(coachUsers);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSessionCreated = () => {
    router.push('/admin/schedule');
  };

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Create Session - Admin Dashboard</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Create New Session</h1>
              <p className="mt-2 text-gray-600">
                Schedule a new coaching session with available coaches.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <SessionForm 
                  coaches={coaches}
                  onSessionCreated={handleSessionCreated}
                  userRole="admin"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 
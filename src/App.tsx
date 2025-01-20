import { useState, useEffect } from 'react';
// import { MapView } from './components/Map';
import { ProfileList } from './components/ProfileList';
import { AdminPanel } from './components/AdminPanel';
import { Auth } from './components/Auth';
import { LocateFixed, Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'admin'>('profiles');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isAuthenticated && activeTab === 'admin') {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white shadow-lg`}
      >
        <div className="p-6">
          <div className="flex items-center mb-6">
            <LocateFixed className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl py-2 px-4 font-bold text-gray-800">ProfileMap</h1>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`w-full px-4 py-2 text-left rounded-md ${activeTab === 'profiles'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Profiles
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full px-4 py-2 text-left rounded-md ${activeTab === 'admin'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Admin Panel
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  setActiveTab('profiles');
                }}
                className="w-full px-4 py-2 text-left rounded-md text-gray-600 hover:bg-gray-100"
              >
                Sign Out
              </button>
            )}
          </nav>
        </div>
        <div className='absolute bottom-0 w-full p-4 text-center text-gray-600'>
          <span>@Created By Aniket</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="px-4 py-3 flex items-center">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto">
            <div className="flex h-full">
              {/* Left Panel */}
              <div className="w-full lg:w-full overflow-y-auto">
                {activeTab === 'profiles' ? <ProfileList /> : <AdminPanel />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
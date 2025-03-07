import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Brain,
  CheckSquare,
  BarChart3,
  Sun,
  Moon,
  Calendar,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { Dialog } from '@headlessui/react';
import NegativeThoughtsLogger from './components/NegativeThoughtsLogger';
import PerformanceTracker from './components/PerformanceTracker';
import TodoList from './components/TodoList';
import DailyRating from './components/DailyRating';
import WeeklyPlanner from './components/WeeklyPlanner';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem('isAuthenticated');
    return auth ? JSON.parse(auth) : false;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (email: string, password: string) => {
    // Fake authentication
    console.log(email, password);
    setIsAuthenticated(true);
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/app' },
    { name: 'Thought Logger', icon: Brain, path: '/app/negative-thoughts' },
    { name: 'Todo List', icon: CheckSquare, path: '/app/todos' },
    { name: 'Weekly Planner', icon: Calendar, path: '/app/weekly-planner' },
    { name: 'Daily Rating', icon: BarChart3, path: '/app/daily-rating' },
    { name: 'Performance', icon: Settings, path: '/app/performance' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/app' && location.pathname !== '/app') return false;
    return location.pathname.startsWith(path);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to='/login' state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  const AppLayout = () => (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar for desktop */}
      <div className='hidden md:flex md:flex-col md:w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col flex-grow pt-8 pb-4 overflow-y-auto'>
          <div className='flex items-center flex-shrink-0 px-6'>
            <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
              Growth<span className='text-primary-600'>Track</span>
            </h1>
          </div>
          <nav className='mt-10 flex-1 px-4 space-y-1'>
            {navigation.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className='px-4 mt-6'>
            <button
              onClick={toggleDarkMode}
              className='w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'
            >
              {darkMode ? (
                <>
                  <Sun className='h-5 w-5 mr-3 text-amber-500' />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className='h-5 w-5 mr-3 text-gray-400' />
                  Dark Mode
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className='w-full flex items-center px-4 py-3 mt-2 text-sm font-medium text-red-600 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200'
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Dialog
        as='div'
        className='md:hidden'
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-50' />
        <Dialog.Panel className='fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
              Growth<span className='text-primary-600'>Track</span>
            </h1>
            <button
              type='button'
              className='rounded-md p-2.5 text-gray-700 dark:text-gray-300'
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-200 dark:divide-gray-700'>
              <div className='space-y-2 py-6'>
                {navigation.map((item) => {
                  const isActive = isActivePath(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className='py-6'>
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setMobileMenuOpen(false);
                  }}
                  className='w-full flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200'
                >
                  {darkMode ? (
                    <>
                      <Sun className='h-5 w-5 mr-3 text-amber-500' />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className='h-5 w-5 mr-3 text-gray-400' />
                      Dark Mode
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className='w-full flex items-center px-4 py-3 mt-2 text-base font-medium text-red-600 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Mobile header */}
      <div className='absolute top-0 z-40 flex items-center gap-x-6   px-4 py-4 shadow-sm sm:px-6 md:hidden'>
        <button
          type='button'
          className='-m-2.5 p-2.5 text-gray-700 dark:text-gray-300'
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className='h-6 w-6 ' aria-hidden='true' />
        </button>
      </div>

      {/* Main Content */}
      <main className='flex-1 relative overflow-y-auto focus:outline-none'>
        <div className='py-12 md:py-6'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
            <Routes>
              <Route path='/' element={<Dashboard darkMode={darkMode} />} />
              <Route
                path='/negative-thoughts'
                element={<NegativeThoughtsLogger darkMode={darkMode} />}
              />
              <Route path='/todos' element={<TodoList darkMode={darkMode} />} />
              <Route
                path='/weekly-planner'
                element={<WeeklyPlanner darkMode={darkMode} />}
              />
              <Route
                path='/daily-rating'
                element={<DailyRating darkMode={darkMode} />}
              />
              <Route
                path='/performance'
                element={<PerformanceTracker darkMode={darkMode} />}
              />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Routes>
        <Route path='/' element={<Landing darkMode={darkMode} />} />
        <Route
          path='/login'
          element={<Login darkMode={darkMode} onLogin={handleLogin} />}
        />
        <Route
          path='/signup'
          element={<SignUp darkMode={darkMode} onSignUp={handleLogin} />}
        />
        <Route
          path='/app/*'
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import { useEffect, useState, Suspense } from 'react';
import { Command } from 'lucide-react';
import { SignInForm } from './components/auth/SignInForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { GridBackground } from './components/ui/GridBackground';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChatPage } from './components/chat/ChatPage';
import { HistoryPage } from './components/history/HistoryPage';
import { useAuth } from './lib/auth';
import { supabase } from './lib/supabase';
import { useNavigate } from './lib/navigate';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { currentPage } = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <Dashboard />;
    }
  };

  if (user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          {renderPage()}
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 relative flex items-center justify-center p-4">
        <GridBackground />
        
        <div className="w-full max-w-md relative">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Command className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Welcome to Composer Kit
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {isSignIn 
                  ? 'Sign in to access your AI development assistant' 
                  : 'Create an account to get started with Composer Kit'}
              </p>
            </div>

            {isSignIn ? <SignInForm /> : <SignUpForm />}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {isSignIn 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Trusted by developers worldwide
            </p>
            <div className="flex justify-center gap-6 mt-4">
              {['GitHub', 'GitLab', 'Bitbucket', 'VS Code'].map((platform) => (
                <div
                  key={platform}
                  className="text-sm font-semibold text-gray-400 dark:text-gray-600"
                >
                  {platform}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
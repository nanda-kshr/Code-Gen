import React, { useEffect, useState } from 'react';
import { Code2, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import axios from 'axios';

export const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

  const openInSandbox = () => {
    // Implementation for opening in sandbox
    console.log('Opening in sandbox...');
  };
  useEffect(() => {
    // Check if user is logged in when the Navbar mounts
    const checkLoginStatus = async () => {
      try {
        await axios.get('http://localhost:3400/api/protected', { withCredentials: true });
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false); // User is not logged in
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3400/api/logout', {}, { withCredentials: true });
      setIsLoggedIn(false); // Update state to logged out
      window.location.href = '/auth'; // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code2 className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CodeGenAI</span>
        </div>
        <div className="flex items-center space-x-4">
            {isLoggedIn ? (
                <Button variant="primary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}

          <button
            onClick={openInSandbox}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Open in Sandbox
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
};
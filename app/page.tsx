'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Minimal Notes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          A comprehensive note-taking application with Firebase integration, advanced search,
          dark mode, and seamless synchronization across all your devices.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/register"
            className="btn-primary px-8 py-4 text-lg font-medium rounded-lg inline-flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="btn-secondary px-8 py-4 text-lg font-medium rounded-lg inline-flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Rich Note Creation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create notes with images, tags, and rich formatting. Auto-save ensures you never lose your work.
          </p>
        </div>
        
        <div className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Advanced Search
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Find notes instantly with powerful search filters by title, content, tags, and date ranges.
          </p>
        </div>
        
        <div className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Cloud Sync
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your notes sync seamlessly across all devices with Firebase. Access anywhere, anytime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8">
          <div className="w-10 h-10 mb-4 text-green-600 dark:text-green-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Dark Mode Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Easy on the eyes with beautiful dark mode that adapts to your system preferences.
          </p>
        </div>
        
        <div className="card p-8">
          <div className="w-10 h-10 mb-4 text-purple-600 dark:text-purple-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Secure & Private
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your data is encrypted and secure with Firebase Authentication and customizable privacy settings.
          </p>
        </div>
      </div>
    </div>
  );
}
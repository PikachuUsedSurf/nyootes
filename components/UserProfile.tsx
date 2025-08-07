'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserPreferences } from '../types';

export const UserProfile: React.FC = () => {
  const { user, updateProfile, uploadProfilePicture, deleteAccount, loading } = useAuth();
  const { exportNotes, importNotes } = useNotes();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        reminders: true,
      },
      privacy: {
        profileVisible: true,
        dataSharing: false,
      },
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        username: formData.username,
        email: formData.email,
        preferences,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      await uploadProfilePicture(file);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const dataStr = await exportNotes();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importNotes(data);
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const updatePreference = (path: string, value: any) => {
    const keys = path.split('.');
    const newPreferences = { ...preferences };
    let current: any = newPreferences;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setPreferences(newPreferences);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleProfilePictureUpload(file);
              }}
              className="hidden"
            />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 form-input rounded-lg"
                  placeholder="Username"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 form-input rounded-lg"
                  placeholder="Email"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading.isLoading}
                    className="btn-primary px-4 py-2 rounded-lg"
                  >
                    {loading.isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.username}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-3 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Appearance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose your preferred theme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          {Object.entries(preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {key} Notifications
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive {key} notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(`notifications.${key}`, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Privacy
        </h2>
        <div className="space-y-4">
          {Object.entries(preferences.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'profileVisible' ? 'Make your profile visible to others' : 'Allow data sharing for analytics'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updatePreference(`privacy.${key}`, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Data Management
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Export Data
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download all your notes and data
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="btn-primary px-4 py-2 rounded-lg"
            >
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Import Data
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Import notes from a backup file
              </p>
            </div>
            <label className="btn-secondary px-4 py-2 rounded-lg cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-200 dark:border-red-800">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Delete Account
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your notes and data.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={loading.isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {loading.isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
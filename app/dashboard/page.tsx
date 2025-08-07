'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import { NoteCard } from '../../components/NoteCard';
import { AdvancedSearchBar } from '../../components/AdvancedSearchBar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { LoadingSpinner, LoadingCard } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorBoundary';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { notes, filteredNotes, searchFilters, setSearchFilters, loading, refreshNotes } = useNotes();

  // Get all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap(note => note.tags || []))
  );

  const isInitialLoading = authLoading.isLoading || (loading.isLoading && notes.length === 0);
  const hasError = loading.error || authLoading.error;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {user?.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {loading.isLoading ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Loading notes...
                </span>
              ) : (
                `You have ${notes.length} note${notes.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {hasError && (
              <button
                onClick={refreshNotes}
                className="btn-secondary px-3 py-2 rounded-lg text-sm"
                disabled={loading.isLoading}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            )}
            <Link
              href="/notes/create"
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Note
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {hasError && (
          <ErrorMessage
            error={hasError}
            onRetry={refreshNotes}
            className="mb-6"
          />
        )}

        {/* Search Bar */}
        {!isInitialLoading && (
          <div className="mb-6">
            <AdvancedSearchBar
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              tags={allTags}
            />
          </div>
        )}

        {/* Content */}
        {isInitialLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>

            {/* Empty State */}
            {filteredNotes.length === 0 && !loading.isLoading && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-400 dark:text-gray-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchFilters.query || searchFilters.tags.length > 0 || searchFilters.dateRange.start || searchFilters.dateRange.end
                    ? 'No notes match your search'
                    : 'No notes yet'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchFilters.query || searchFilters.tags.length > 0 || searchFilters.dateRange.start || searchFilters.dateRange.end
                    ? 'Try adjusting your search filters or create a new note.'
                    : 'Create your first note to get started with organizing your thoughts.'
                  }
                </p>
                <Link
                  href="/notes/create"
                  className="btn-primary px-6 py-3 rounded-lg inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Note
                </Link>
              </div>
            )}
          </>
        )}

        {/* Loading overlay for operations */}
        {loading.isLoading && notes.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {loading.operation === 'createNote' && 'Creating note...'}
                {loading.operation === 'updateNote' && 'Updating note...'}
                {loading.operation === 'deleteNote' && 'Deleting note...'}
                {loading.operation === 'refreshNotes' && 'Refreshing notes...'}
                {!loading.operation && 'Loading...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { NoteForm } from '../../../components/NoteForm';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { useNotes } from '../../../contexts/NotesContext';
import { useRouter } from 'next/navigation';

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getNoteById, deleteNote } = useNotes();
  const [note, setNote] = useState<any>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const foundNote = getNoteById(params.id);
    setNote(foundNote);
  }, [params.id, getNoteById]);

  const handleSave = () => {
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (note) {
      await deleteNote(note.id);
      router.push('/dashboard');
    }
  };

  if (!note) {
    return (
      <ProtectedRoute>
        <div className="max-w-3xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
            <p className="text-gray-600 mb-6">The note you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        {!isEditing ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{note.title}</h1>
                <p className="text-gray-500 mt-1">
                  Created {new Date(note.createdAt).toLocaleDateString()} • 
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {note.tags && note.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {note.images && note.images.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-4">
                  {note.images.map((image: string, index: number) => (
                    <img key={index} src={image} alt={`Note image ${index + 1}`} className="h-48 w-48 object-cover rounded" />
                  ))}
                </div>
              </div>
            )}
            
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{note.content}</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
            </div>
            <NoteForm note={note} onSave={handleSave} onCancel={handleCancel} />
          </div>
        )}
        
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Note</h3>
              <p className="text-gray-500 mb-4">
                Are you sure you want to delete "{note.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
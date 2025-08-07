'use client';

import { useState, useEffect } from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../lib/firebaseService';

interface Note {
  id: string;
  title: string;
  content: string;
  images: string[]; // Array of image URLs
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  userId: string;
}

interface NoteFormProps {
  note?: Note;
  onSave?: () => void;
  onCancel?: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [images, setImages] = useState<string[]>(note?.images || []);
  const [tags, setTags] = useState(note?.tags?.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { createNote, updateNote } = useNotes();
  const { user } = useAuth();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setImages(note.images || []);
      setTags(note.tags?.join(', ') || '');
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setIsSaving(true);
    
    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (note) {
        // Update existing note
        await updateNote(note.id, { title, content, images, tags: tagArray });
      } else {
        // Create new note
        await createNote(title, content, images, tagArray);
      }
      
      setLastSaved(new Date());
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  return (
    <form className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          {lastSaved && (
            <span className="text-xs text-gray-500">
              Saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Note title"
        />
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          required
          rows={15}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Note content"
        />
      </div>
      
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
          Images
        </label>
        <div className="mt-1 flex flex-col items-center">
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Note image ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file && user) {
                setIsUploading(true);
                try {
                  // Upload file to Firebase Storage
                  const downloadURL = await firebaseService.uploadNoteImage(file, user.id);
                  setImages([...images, downloadURL]);
                } catch (error) {
                  console.error('Error uploading image:', error);
                  alert('Failed to upload image. Please try again.');
                } finally {
                  setIsUploading(false);
                }
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="mt-2 text-sm text-gray-500">
              Uploading image...
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={handleTagsChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="work, personal, ideas"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {/* Status indicators would go here in a more advanced implementation */}
        </div>
        
        <div className="flex space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </form>
  );
};
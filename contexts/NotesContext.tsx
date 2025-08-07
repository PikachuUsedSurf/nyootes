'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseService } from '../lib/firebaseService';
import { useAuth } from './AuthContext';
import { Note, SearchFilters, LoadingState } from '../types';

interface NotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  loading: LoadingState;
  searchFilters: SearchFilters;
  createNote: (title: string, content: string, images?: string[], tags?: string[]) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNoteById: (id: string) => Note | undefined;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  exportNotes: () => Promise<string>;
  importNotes: (data: any) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({
    query: '',
    tags: [],
    dateRange: {},
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    searchIn: ['title', 'content', 'tags'],
  });

  // Load notes when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const unsubscribe = firebaseService.onNotesChange(user.id, (notes) => {
        setNotes(notes);
        setLoading({ isLoading: false, error: null });
      });

      return unsubscribe;
    } else {
      setNotes([]);
      setFilteredNotes([]);
    }
  }, [isAuthenticated, user]);

  // Apply filters whenever notes or filters change
  useEffect(() => {
    let result = [...notes];

    // Apply search query
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      result = result.filter(note => {
        const searchableFields = [];
        
        if (searchFilters.searchIn.includes('title')) {
          searchableFields.push(note.title.toLowerCase());
        }
        if (searchFilters.searchIn.includes('content')) {
          searchableFields.push(note.content.toLowerCase());
        }
        if (searchFilters.searchIn.includes('tags')) {
          searchableFields.push(...(note.tags || []).map(tag => tag.toLowerCase()));
        }
        
        return searchableFields.some(field => field.includes(query));
      });
    }

    // Apply tag filters
    if (searchFilters.tags.length > 0) {
      result = result.filter(note =>
        note.tags && searchFilters.tags.some(tag => note.tags.includes(tag))
      );
    }

    // Apply date range filter
    if (searchFilters.dateRange.start || searchFilters.dateRange.end) {
      result = result.filter(note => {
        const noteDate = new Date(note[searchFilters.sortBy]);
        const start = searchFilters.dateRange.start;
        const end = searchFilters.dateRange.end;
        
        if (start && noteDate < start) return false;
        if (end && noteDate > end) return false;
        
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = new Date(a[searchFilters.sortBy]).getTime();
      const bValue = new Date(b[searchFilters.sortBy]).getTime();
      
      if (searchFilters.sortBy === 'title') {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        return searchFilters.sortOrder === 'desc'
          ? bTitle.localeCompare(aTitle)
          : aTitle.localeCompare(bTitle);
      }
      
      return searchFilters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    setFilteredNotes(result);
  }, [notes, searchFilters]);

  const createNote = async (title: string, content: string, images: string[] = [], tags: string[] = []): Promise<Note> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading({ isLoading: true, error: null, operation: 'createNote' });
    try {
      const newNote = await firebaseService.createNote({
        title,
        content,
        images,
        tags,
        userId: user.id,
      });
      setLoading({ isLoading: false, error: null });
      return newNote;
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>): Promise<void> => {
    setLoading({ isLoading: true, error: null, operation: 'updateNote' });
    try {
      await firebaseService.updateNote(id, updates);
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    setLoading({ isLoading: true, error: null, operation: 'deleteNote' });
    try {
      await firebaseService.deleteNote(id);
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
  };

  const setSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFiltersState(prev => ({ ...prev, ...filters }));
  };

  const exportNotes = async (): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading({ isLoading: true, error: null, operation: 'exportNotes' });
    try {
      const exportData = await firebaseService.exportUserData(user.id);
      const dataStr = JSON.stringify(exportData, null, 2);
      setLoading({ isLoading: false, error: null });
      return dataStr;
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const importNotes = async (data: any): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading({ isLoading: true, error: null, operation: 'importNotes' });
    try {
      await firebaseService.importUserData(user.id, data);
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const refreshNotes = async (): Promise<void> => {
    if (!user) return;
    
    setLoading({ isLoading: true, error: null, operation: 'refreshNotes' });
    try {
      const userNotes = await firebaseService.getUserNotes(user.id);
      setNotes(userNotes);
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const value: NotesContextType = {
    notes,
    filteredNotes,
    loading,
    searchFilters,
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    setSearchFilters,
    exportNotes,
    importNotes,
    refreshNotes,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
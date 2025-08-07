// Date formatting utilities
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ID generation utility
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Search and filter utilities
export const searchNotes = (notes: any[], query: string): any[] => {
  if (!query) return notes;
  
  const lowerQuery = query.toLowerCase();
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowerQuery) ||
    note.content.toLowerCase().includes(lowerQuery)
  );
};

export const filterNotesByTag = (notes: any[], tag: string): any[] => {
  if (!tag) return notes;
  
  return notes.filter(note => 
    note.tags && note.tags.includes(tag)
  );
};

export const sortNotesByDate = (notes: any[], order: 'asc' | 'desc' = 'desc'): any[] => {
  return [...notes].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};
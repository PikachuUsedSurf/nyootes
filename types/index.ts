export interface Note {
  id: string;
  title: string;
  content: string;
  images: string[]; // Array of image URLs or base64 encoded images
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  userId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // hashed - optional for Firebase users
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
  };
  language: string;
  timezone: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string; // For visual distinction
  userId: string;
}

export type NoteFormData = {
  title: string;
  content: string;
  tags?: string[];
};

export type UserRegistrationData = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginData = {
  email: string;
  password: string;
};

export interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  searchIn: ('title' | 'content' | 'tags')[];
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  operation?: string;
}

export interface ExportData {
  notes: Note[];
  user: Partial<User>;
  exportDate: Date;
  version: string;
}
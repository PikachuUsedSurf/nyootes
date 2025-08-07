// Local Storage Service
class LocalStorageService {
  private static readonly NOTES_KEY = 'minimal_notes';
  private static readonly USERS_KEY = 'minimal_users';
  private static readonly TAGS_KEY = 'minimal_tags';
  private static readonly CURRENT_USER_KEY = 'minimal_current_user';

  // Notes operations
  static getNotes(): any[] {
    const notes = localStorage.getItem(this.NOTES_KEY);
    return notes ? JSON.parse(notes) : [];
  }

  static saveNotes(notes: any[]): void {
    localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
  }

  static addNote(note: any): void {
    const notes = this.getNotes();
    notes.push(note);
    this.saveNotes(notes);
  }

  static updateNote(updatedNote: any): void {
    const notes = this.getNotes();
    const index = notes.findIndex((note: any) => note.id === updatedNote.id);
    if (index !== -1) {
      notes[index] = updatedNote;
      this.saveNotes(notes);
    }
  }

  static deleteNote(noteId: string): void {
    const notes = this.getNotes();
    const filteredNotes = notes.filter((note: any) => note.id !== noteId);
    this.saveNotes(filteredNotes);
  }

  // Users operations
  static getUsers(): any[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: any[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static addUser(user: any): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  static getUserByEmail(email: string): any | undefined {
    const users = this.getUsers();
    return users.find((user: any) => user.email === email);
  }

  static getUserById(id: string): any | undefined {
    const users = this.getUsers();
    return users.find((user: any) => user.id === id);
  }

  // Tags operations
  static getTags(): any[] {
    const tags = localStorage.getItem(this.TAGS_KEY);
    return tags ? JSON.parse(tags) : [];
  }

  static saveTags(tags: any[]): void {
    localStorage.setItem(this.TAGS_KEY, JSON.stringify(tags));
  }

  static addTag(tag: any): void {
    const tags = this.getTags();
    tags.push(tag);
    this.saveTags(tags);
  }

  // Authentication operations
  static getCurrentUser(): any | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: any | null): void {
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

export { LocalStorageService };
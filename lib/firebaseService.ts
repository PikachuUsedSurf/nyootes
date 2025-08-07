import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  writeBatch,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { auth, db, storage } from './firebase';
import { User, Note, UserPreferences, ExportData, LoadingState } from '../types';

class FirebaseService {
  // Authentication methods
  async registerUser(email: string, password: string, username: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: username,
      });

      const defaultPreferences: UserPreferences = {
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
      };

      const newUser: User = {
        id: firebaseUser.uid,
        username,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: defaultPreferences,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newUser;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async loginUser(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      return {
        ...userData,
        id: firebaseUser.uid,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      } as User;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const user: User = {
              ...userData,
              id: firebaseUser.uid,
              createdAt: userData.createdAt?.toDate() || new Date(),
              updatedAt: userData.updatedAt?.toDate() || new Date(),
            } as User;
            callback(user);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // User profile methods
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  async uploadProfilePicture(userId: string, file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `profile-pictures/${userId}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      await this.updateUserProfile(userId, { profilePicture: downloadURL });
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message || 'Profile picture upload failed');
    }
  }
async uploadNoteImage(file: File, userId: string): Promise<string> {
    try {
      // Create a unique filename using timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const filename = `${timestamp}-${randomString}-${file.name}`;
      
      // Create storage reference with user-specific path
      const storageRef = ref(storage, `notes/${userId}/${filename}`);
      
      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message || 'Image upload failed');
    }
  }

  async deleteProfilePicture(userId: string): Promise<void> {
    try {
      const storageRef = ref(storage, `profile-pictures/${userId}`);
      await deleteObject(storageRef);
      await this.updateUserProfile(userId, { profilePicture: undefined });
    } catch (error: any) {
      throw new Error(error.message || 'Profile picture deletion failed');
    }
  }

  // Notes methods
  async createNote(noteData: {
    title: string;
    content: string;
    images?: string[];
    tags?: string[];
    userId: string;
  }): Promise<Note> {
    try {
      const notesRef = collection(db, 'notes');
      const docRef = doc(notesRef);
      
      const newNote: Note = {
        id: docRef.id,
        title: noteData.title,
        content: noteData.content,
        images: noteData.images || [],
        tags: noteData.tags || [],
        userId: noteData.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(docRef, {
        ...newNote,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return newNote;
    } catch (error: any) {
      throw new Error(error.message || 'Note creation failed');
    }
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      throw new Error(error.message || 'Note update failed');
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
    } catch (error: any) {
      throw new Error(error.message || 'Note deletion failed');
    }
  }

  async getUserNotes(userId: string): Promise<Note[]> {
    try {
      const notesQuery = query(
        collection(db, 'notes'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(notesQuery);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Note;
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch notes');
    }
  }

  onNotesChange(userId: string, callback: (notes: Note[]) => void): () => void {
    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(notesQuery, (snapshot) => {
      const notes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Note;
      });
      callback(notes);
    });
  }

  // Data export/import methods
  async exportUserData(userId: string): Promise<ExportData> {
    try {
      const [userDoc, notes] = await Promise.all([
        getDoc(doc(db, 'users', userId)),
        this.getUserNotes(userId)
      ]);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const exportData: ExportData = {
        notes,
        user: {
          id: userId,
          username: userData.username,
          email: userData.email,
          preferences: userData.preferences,
          createdAt: userData.createdAt?.toDate() || new Date(),
        },
        exportDate: new Date(),
        version: '1.0.0',
      };

      return exportData;
    } catch (error: any) {
      throw new Error(error.message || 'Data export failed');
    }
  }

  async importUserData(userId: string, data: ExportData): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Import notes
      data.notes.forEach(note => {
        const noteRef = doc(collection(db, 'notes'));
        batch.set(noteRef, {
          ...note,
          id: noteRef.id,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    } catch (error: any) {
      throw new Error(error.message || 'Data import failed');
    }
  }

  async deleteUserAccount(userId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Delete all user notes
      const notesQuery = query(
        collection(db, 'notes'),
        where('userId', '==', userId)
      );
      const notesSnapshot = await getDocs(notesQuery);
      notesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Delete user profile
      batch.delete(doc(db, 'users', userId));

      await batch.commit();

      // Delete profile picture if exists
      try {
        await this.deleteProfilePicture(userId);
      } catch (error) {
        // Profile picture might not exist, ignore error
      }

      // Delete Firebase auth user
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
    } catch (error: any) {
      throw new Error(error.message || 'Account deletion failed');
    }
  }

  // Offline support methods
  async enableOfflineSupport(): Promise<void> {
    try {
      await enableNetwork(db);
    } catch (error: any) {
      console.error('Failed to enable offline support:', error);
    }
  }

  async disableOfflineSupport(): Promise<void> {
    try {
      await disableNetwork(db);
    } catch (error: any) {
      console.error('Failed to disable offline support:', error);
    }
  }
}

export const firebaseService = new FirebaseService();
# Minimal Notes - Comprehensive Note-Taking Application

A modern, feature-rich note-taking application built with Next.js, TypeScript, Firebase, and Tailwind CSS. This application provides a seamless experience for creating, organizing, and managing your notes with advanced features like real-time search, dark mode, cloud synchronization, and comprehensive user profile management.

## 🚀 Features

### Core Functionality
- **Rich Note Creation**: Create notes with titles, content, images, and tags
- **Real-time Auto-save**: Never lose your work with automatic saving
- **Image Support**: Upload and attach images to your notes
- **Tag System**: Organize notes with customizable tags

### Advanced Search & Filtering
- **Real-time Search**: Instant search as you type
- **Advanced Filters**: Search by title, content, tags, and date ranges
- **Multiple Search Fields**: Choose what to search in (title, content, tags)
- **Sort Options**: Sort by creation date, modification date, or title
- **Filter by Tags**: Quick filtering by selecting tags
- **Search Highlighting**: Visual feedback for active filters

### User Profile & Settings
- **Comprehensive Profile Management**: Update username, email, and profile picture
- **Theme Preferences**: Light, dark, and system theme options
- **Notification Settings**: Customize email, push, and reminder notifications
- **Privacy Controls**: Manage profile visibility and data sharing preferences
- **Account Management**: Export data, import backups, and delete account

### Firebase Integration
- **Authentication**: Secure user registration and login
- **Cloud Storage**: Real-time synchronization across devices
- **Offline Support**: Work offline with automatic sync when reconnected
- **Profile Pictures**: Upload and manage profile images in Firebase Storage
- **Data Export/Import**: Backup and restore your notes

### User Experience
- **Dark Mode**: Beautiful dark theme with system preference detection
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators for all operations
- **Error Handling**: Comprehensive error handling with retry options
- **Accessibility**: WCAG compliant with proper focus management

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark mode support
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Form Validation**: Zod
- **Icons**: Heroicons (SVG)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd minimal-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
minimal-notes/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard
│   ├── notes/                    # Note-related pages
│   ├── profile/                  # User profile page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable components
│   ├── AdvancedSearchBar.tsx     # Advanced search component
│   ├── AuthForm.tsx              # Authentication forms
│   ├── ErrorBoundary.tsx         # Error handling
│   ├── Header.tsx                # Navigation header
│   ├── LoadingSpinner.tsx        # Loading components
│   ├── NoteCard.tsx              # Note display card
│   ├── NoteForm.tsx              # Note creation/editing
│   ├── ProtectedRoute.tsx        # Route protection
│   ├── SearchBar.tsx             # Basic search
│   ├── TagManager.tsx            # Tag management
│   └── UserProfile.tsx           # Profile management
├── contexts/                     # React contexts
│   ├── AuthContext.tsx           # Authentication state
│   ├── NotesContext.tsx          # Notes management
│   └── ThemeContext.tsx          # Theme management
├── hooks/                        # Custom hooks
│   ├── useAutoSave.ts            # Auto-save functionality
│   └── useKeyboardShortcuts.ts   # Keyboard shortcuts
├── lib/                          # Utility libraries
│   ├── firebase.ts               # Firebase configuration
│   ├── firebaseService.ts        # Firebase operations
│   ├── storage.ts                # Local storage utilities
│   ├── utils.ts                  # General utilities
│   └── validation.ts             # Form validation
└── types/                        # TypeScript definitions
    └── index.ts                  # Type definitions
```

## 🔧 Configuration

### Firebase Setup
1. **Authentication**: Enable Email/Password authentication
2. **Firestore Rules**: Set up security rules for your database
3. **Storage Rules**: Configure storage security rules
4. **Indexes**: Create composite indexes for efficient queries

### Environment Variables
All Firebase configuration should be added to `.env.local`:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🎨 Customization

### Themes
The application supports light and dark themes with system preference detection. Customize colors in:
- `tailwind.config.ts` - Tailwind configuration
- `app/globals.css` - Custom CSS variables and dark mode styles

### Components
All components are built with TypeScript and Tailwind CSS for easy customization:
- Modify component styles in individual component files
- Update global styles in `app/globals.css`
- Customize theme colors in Tailwind configuration

## 📱 Features in Detail

### Advanced Search
- **Real-time filtering**: Results update as you type
- **Multiple search fields**: Search in title, content, or tags
- **Date range filtering**: Filter notes by creation or modification date
- **Tag filtering**: Quick filter by selecting tags
- **Sort options**: Sort by date, title, or relevance
- **Search persistence**: Filters persist during session

### User Profile Management
- **Profile editing**: Update username, email, and profile picture
- **Theme preferences**: Choose light, dark, or system theme
- **Notification settings**: Customize notification preferences
- **Privacy controls**: Manage data sharing and profile visibility
- **Data management**: Export/import notes, delete account

### Firebase Integration
- **Real-time sync**: Changes sync instantly across devices
- **Offline support**: Work offline with automatic sync
- **Secure authentication**: Firebase Auth with email/password
- **Cloud storage**: Profile pictures stored in Firebase Storage
- **Data backup**: Export all data in JSON format

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Self-hosted

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Heroicons](https://heroicons.com/) - Beautiful SVG icons
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation above
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using Next.js, Firebase, and Tailwind CSS
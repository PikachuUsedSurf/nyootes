import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { NotesProvider } from '../contexts/NotesContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/Header';

export const metadata = {
  title: 'Minimal Notes - Your Digital Notebook',
  description: 'A comprehensive note-taking application with Firebase integration, dark mode, and advanced search capabilities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <NotesProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                  <Header />
                  <main className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </main>
                </div>
              </NotesProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
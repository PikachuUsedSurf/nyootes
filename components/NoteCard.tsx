import Link from 'next/link';
import { formatDate } from '../lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  images: string[]; // Array of image URLs or base64 encoded images
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  userId: string;
}

interface NoteCardProps {
  note: Note;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  return (
    <Link href={`/notes/${note.id}`} className="block h-full">
      <div className="h-full card card-hover transition-all duration-200 p-4 animate-fade-in">
        {note.images && note.images.length > 0 && (
          <div className="mb-3">
            <img
              src={note.images[0]}
              alt="Note thumbnail"
              className="h-32 w-full object-cover rounded-lg"
            />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate mb-2">
          {note.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
          {note.content}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(note.createdAt)}
          </span>
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  +{note.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
'use client';

import { NoteForm } from '../../../components/NoteForm';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function CreateNotePage() {
  const router = useRouter();
  
  const handleSave = () => {
    router.push('/dashboard');
  };
  
  const handleCancel = () => {
    router.push('/dashboard');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
        </div>
        <NoteForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    </ProtectedRoute>
  );
}
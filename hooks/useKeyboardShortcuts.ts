'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onSearchFocus?: () => void;
}

export const useKeyboardShortcuts = ({ onSave, onSearchFocus }: KeyboardShortcutsProps = {}) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys are pressed with the shortcut
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

      // Focus search input
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        if (onSearchFocus) onSearchFocus();
      }

      // Create new note
      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        router.push('/notes/create');
      }

      // Save current note
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        if (onSave) onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onSearchFocus, router]);
};
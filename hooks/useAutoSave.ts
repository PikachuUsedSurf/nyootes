'use client';

import { useState, useEffect, useRef } from 'react';

interface UseAutoSaveProps {
  onSave: () => void;
  delay?: number;
}

export const useAutoSave = ({ onSave, delay = 3000 }: UseAutoSaveProps) => {
  const [dirty, setDirty] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!dirty) return;

    // Clear any existing timeout
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    // Set new timeout
    saveTimeout.current = setTimeout(() => {
      onSave();
      setDirty(false);
    }, delay);

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [dirty, onSave, delay]);

  // Function to mark data as dirty (needs saving)
  const markDirty = () => {
    setDirty(true);
  };

  // Function to manually trigger save
  const saveNow = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    onSave();
    setDirty(false);
  };

  return { markDirty, saveNow, isDirty: dirty };
};
'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'livekit-credentials';

export interface LiveKitCredentials {
  url: string;
  apiKey: string;
  apiSecret: string;
}

interface UseLiveKitCredentialsReturn {
  credentials: LiveKitCredentials | null;
  hasCredentials: boolean;
  saveCredentials: (credentials: LiveKitCredentials) => void;
  clearCredentials: () => void;
  isLoading: boolean;
}

function getStoredCredentials(): LiveKitCredentials | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.apiKey && parsed.apiSecret) {
        return parsed as LiveKitCredentials;
      }
    }
  } catch {
    // Invalid JSON or localStorage error
  }
  return null;
}

export function useLiveKitCredentials(): UseLiveKitCredentialsReturn {
  const [credentials, setCredentials] = useState<LiveKitCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCredentials(getStoredCredentials());
    setIsLoading(false);
  }, []);

  const saveCredentials = useCallback((newCredentials: LiveKitCredentials) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
      setCredentials(newCredentials);
    } catch (error) {
      console.error('Failed to save credentials to localStorage:', error);
    }
  }, []);

  const clearCredentials = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCredentials(null);
    } catch (error) {
      console.error('Failed to clear credentials from localStorage:', error);
    }
  }, []);

  return {
    credentials,
    hasCredentials: credentials !== null,
    saveCredentials,
    clearCredentials,
    isLoading,
  };
}

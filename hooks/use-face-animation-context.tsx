'use client';

import { type ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { FaceAnimation } from '@/lib/face-animation/types';
import { FACE_ANIMATIONS } from '@/lib/face-animation/types';

interface FaceAnimationContextType {
  currentAnimation: FaceAnimation;
  animationDuration: number | null;
  setAnimation: (animation: FaceAnimation, duration?: number | null) => void;
  clearAnimation: () => void;
}

const FaceAnimationContext = createContext<FaceAnimationContextType | null>(null);

export function FaceAnimationProvider({ children }: { children: ReactNode }) {
  const [currentAnimation, setCurrentAnimation] = useState<FaceAnimation>('neutral');
  const [animationDuration, setAnimationDuration] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setAnimation = useCallback((animation: FaceAnimation, duration: number | null = null) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCurrentAnimation(animation);
    setAnimationDuration(duration);

    // Auto-reset to neutral after duration if specified
    if (duration !== null && duration > 0) {
      timeoutRef.current = setTimeout(() => {
        setCurrentAnimation('neutral');
        setAnimationDuration(null);
        timeoutRef.current = null;
      }, duration * 1000);
    }
  }, []);

  const clearAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setCurrentAnimation('neutral');
    setAnimationDuration(null);
  }, []);

  // Expose test function in development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { testFaceAnimation?: (animation: string, duration?: number) => void }).testFaceAnimation = (
        animation: string,
        duration?: number
      ) => {
        if (FACE_ANIMATIONS.includes(animation as FaceAnimation)) {
          setAnimation(animation as FaceAnimation, duration ?? null);
          console.log(`[Test] Face animation set to: ${animation}`, { duration });
        } else {
          console.error(`[Test] Invalid animation: ${animation}. Valid: ${FACE_ANIMATIONS.join(', ')}`);
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as Window & { testFaceAnimation?: unknown }).testFaceAnimation;
      }
    };
  }, [setAnimation]);

  return (
    <FaceAnimationContext.Provider
      value={{ currentAnimation, animationDuration, setAnimation, clearAnimation }}
    >
      {children}
    </FaceAnimationContext.Provider>
  );
}

export function useFaceAnimation() {
  const context = useContext(FaceAnimationContext);
  if (!context) {
    throw new Error('useFaceAnimation must be used within FaceAnimationProvider');
  }
  return context;
}

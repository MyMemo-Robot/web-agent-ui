'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { AnimatePresence, motion } from 'motion/react';
import type { FaceAnimation } from '@/lib/face-animation/types';
import { FACE_ANIMATION_PATHS } from '@/lib/face-animation/types';
import { cn } from '@/lib/shadcn/utils';

interface AgentFaceAnimationProps {
  animation: FaceAnimation;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-[60px] w-[60px]',
  md: 'h-[90px] w-[90px]',
  lg: 'h-[120px] w-[120px]',
};

export function AgentFaceAnimation({ animation, size = 'md', className }: AgentFaceAnimationProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnimation = async () => {
      setIsLoading(true);
      try {
        const path = FACE_ANIMATION_PATHS[animation];
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${response.statusText}`);
        }
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error(`[FaceAnimation] Failed to load animation "${animation}":`, error);
        setAnimationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, [animation]);

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-md',
        SIZE_CLASSES[size],
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="bg-muted h-full w-full animate-pulse rounded-md"
          />
        ) : animationData ? (
          <motion.div
            key={animation}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            className="h-full w-full"
          >
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              className="h-full w-full"
            />
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground flex h-full w-full items-center justify-center text-xs"
          >
            {animation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

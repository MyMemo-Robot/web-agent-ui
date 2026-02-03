'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { FaceAnimation } from '@/lib/face-animation/types';
import { FACE_VIDEO_PATHS } from '@/lib/face-animation/types';
import { cn } from '@/lib/shadcn/utils';

interface AgentVideoAnimationProps {
  animation: FaceAnimation;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loop?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

const SIZE_CLASSES = {
  sm: 'h-[60px] w-[60px]',
  md: 'h-[90px] w-[90px]',
  lg: 'h-[120px] w-[120px]',
};

export function AgentVideoAnimation({
  animation,
  size = 'md',
  className,
  loop = true,
  muted = true,
  onEnded,
}: AgentVideoAnimationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [animation]);

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error(`[VideoAnimation] Failed to load video: ${animation}`);
  };

  const videoPath = FACE_VIDEO_PATHS[animation];

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-md',
        SIZE_CLASSES[size],
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading && !hasError ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="bg-muted h-full w-full animate-pulse rounded-md"
          />
        ) : hasError ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground flex h-full w-full items-center justify-center text-xs"
          >
            {animation}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.video
        key={animation}
        ref={videoRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isLoading || hasError ? 0 : 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        src={videoPath}
        autoPlay
        loop={loop}
        muted={muted}
        playsInline
        onCanPlay={handleCanPlay}
        onError={handleError}
        onEnded={onEnded}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

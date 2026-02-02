'use client';

import { AgentFaceAnimation } from '@/components/agents-ui/agent-face-animation';
import { FACE_ANIMATIONS, type FaceAnimation } from '@/lib/face-animation/types';
import { cn } from '@/lib/shadcn/utils';

interface AnimationCardProps {
  animation: FaceAnimation;
}

function AnimationCard({ animation }: AnimationCardProps) {
  const displayName = animation.charAt(0).toUpperCase() + animation.slice(1);

  return (
    <div
      className={cn(
        'bg-card border-border flex flex-col items-center gap-4 rounded-lg border p-6',
        'transition-all duration-200 hover:shadow-lg',
        'hover:border-primary/50'
      )}
    >
      <AgentFaceAnimation animation={animation} size="lg" />
      <span className="text-foreground font-medium">{displayName}</span>
    </div>
  );
}

export function AnimationsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
      {FACE_ANIMATIONS.map((animation) => (
        <AnimationCard key={animation} animation={animation} />
      ))}
    </div>
  );
}

// Face animation types matching server-side FaceAnimation enum
export type FaceAnimation =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'thinking'
  | 'surprised'
  | 'curious'
  | 'excited'
  | 'concerned'
  | 'loving';

// RPC payload types (matching server-side Pydantic models)
export interface PlayFaceAnimationPayload {
  animation: FaceAnimation;
  duration: number | null;
}

export interface PlayFaceAnimationResponse {
  success: boolean;
  message: string;
  animation_played: string | null;
  error_code: number | null;
}

// RPC method name constant
export const RPC_PLAY_FACE_ANIMATION = 'robot.play_face_animation';

// Mapping of animation names to Lottie JSON file paths
export const FACE_ANIMATION_PATHS: Record<FaceAnimation, string> = {
  neutral: '/animations/neutral.json',
  happy: '/animations/happy.json',
  sad: '/animations/sad.json',
  thinking: '/animations/thinking.json',
  surprised: '/animations/surprised.json',
  curious: '/animations/curious.json',
  excited: '/animations/excited.json',
  concerned: '/animations/concerned.json',
  loving: '/animations/loving.json',
};

// Mapping of animation names to video file paths
export const FACE_VIDEO_PATHS: Record<FaceAnimation, string> = {
  neutral: '/animations/videos/neutral.mp4',
  happy: '/animations/videos/happy.mp4',
  sad: '/animations/videos/sad.mp4',
  thinking: '/animations/videos/thinking.mp4',
  surprised: '/animations/videos/surprised.mp4',
  curious: '/animations/videos/curious.mp4',
  excited: '/animations/videos/excited.mp4',
  concerned: '/animations/videos/concerned.mp4',
  loving: '/animations/videos/loving.mp4',
};

// All available face animations
export const FACE_ANIMATIONS: FaceAnimation[] = [
  'neutral',
  'happy',
  'sad',
  'thinking',
  'surprised',
  'curious',
  'excited',
  'concerned',
  'loving',
];

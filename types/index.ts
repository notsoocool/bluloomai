/**
 * BluLoomAI - Shared TypeScript types
 */

// ============ Instagram / Meta API ============

export interface InstagramAccount {
  id: string;
  userId: string;
  instagramBusinessAccountId: string;
  username: string;
  followersCount: number;
  profilePictureUrl?: string;
  accessToken: string;
  tokenExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  instagramAccountId: string;
  instagramPostId: string;
  caption: string | null;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl?: string;
  permalink?: string;
  timestamp: Date;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  instagramCommentId: string;
  text: string;
  username: string;
  timestamp: Date;
  likeCount: number;
  createdAt: Date;
}

// ============ Analytics ============

export interface EngagementMetrics {
  engagementRate: number;
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
  avgEngagementRate: number;
}

export interface EngagementByTime {
  dayOfWeek: number; // 0-6
  hourOfDay: number; // 0-23
  totalEngagement: number;
  postCount: number;
  avgEngagementRate: number;
}

export interface PostPerformanceTier {
  tier: "top" | "bottom";
  postIds: string[];
  avgEngagementRate: number;
  count: number;
}

export interface AnalyticsSummary {
  metrics: EngagementMetrics;
  byDayOfWeek: EngagementByTime[];
  byHourOfDay: EngagementByTime[];
  topPosts: PostPerformanceTier;
  bottomPosts: PostPerformanceTier;
  bestPostingSlots: PostingSlot[];
}

export interface PostingSlot {
  dayOfWeek: number;
  hourOfDay: number;
  score: number;
  label: string; // e.g. "Monday 6pm"
}

// ============ AI Analysis ============

export interface PostAnalysis {
  hookStrengthScore: number;
  ctaPresenceScore: number;
  hashtagQualityScore: number;
  commentSentimentSummary: string;
  improvementSuggestions: string[];
  growthSummary: string;
}

export interface ViralPatternInsights {
  topVsBottomComparison: {
    hookStructure: string;
    captionLength: string;
    ctaUsage: string;
    hashtagDensity: string;
  };
  growthInsights: string[];
}

// ============ Content Generation ============

export interface ReelScript {
  hook: string;
  problem: string;
  valueBullets: string[];
  retentionTrigger: string;
  cta: string;
  suggestedCommentTrigger: string;
}

export interface CaptionGenerationParams {
  niche: string;
  tone: "casual" | "professional" | "inspirational" | "educational";
  goal: "reach" | "saves" | "comments";
}

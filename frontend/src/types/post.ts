export type PostInsight = {
  id: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'STORY';
  mediaProductType: 'FEED' | 'REELS' | 'STORY';
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
  impressions: number;
  reach: number;
  saved: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  plays?: number;
  replies?: number;
}; 
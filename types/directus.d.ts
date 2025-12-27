export interface WelcomeMessageData {
  id: number;
  message: string;
}

export interface HeaderMessageData {
  id: number;
  header: string;
}

export interface LinkData {
  id: number;
  url: string;
  title: string;
  sort: number;
}

export interface BackgroundVideoData {
  id: number;
  video_url: string;
  is_active?: boolean;
}
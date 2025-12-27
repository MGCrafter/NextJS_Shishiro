export interface WelcomeMessageData {
  id: number;
  message: string;
}

export interface HeaderMessageData {
  id: number;
  header: string;
  font?: string;
}

export interface LinkData {
  id: number;
  url: string;
  title: string;
  sort: number;
  theme?: string;
  custom_color?: string;
}

export interface BackgroundVideoData {
  id: number;
  video_url: string;
  is_active?: boolean;
}
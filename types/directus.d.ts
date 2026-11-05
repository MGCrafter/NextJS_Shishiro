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

export interface AppearanceSettings {
  gradient_color_1: string;
  gradient_color_2: string;
  gradient_opacity: number;
  gradient_thickness: number;
  button_bg_color: string;
  text_color: string;
  font_family: string;
}

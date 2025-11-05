export type ThemeName = 'light' | 'dark' | 'blue' | 'warm';

export interface Theme {
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
  appBackground: string;
}

export interface InlineEditorHandle {
  getContent(): string;
  setContent?(value: string): void;
}

export interface InlineEditorProps {
  initialContent?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  borderColor?: string;
  className?: string;
  style?: import('react').CSSProperties;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
}

export default {} as const;

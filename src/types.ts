export type ThemeName = 'light' | 'dark' | 'blue' | 'warm';

export interface Theme {
  backgroundColor: string;
  foregroundColor: string;
  borderColor: string;
  appBackground: string;
}

export type InlineEditorMode = 'visual' | 'html';

export interface InlineEditorHeaderSlotProps {
  mode: InlineEditorMode;
  toggleMode(): void;
  setMode(mode: InlineEditorMode): void;
}

export interface InlineEditorHandle {
  getContent(): string;
  setContent?(value: string): void;
  toggleMode?(): void;
  getMode?(): InlineEditorMode;
  setMode?(mode: InlineEditorMode): void;
}

export interface InlineEditorProps {
  id?: string;
  initialContent?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  borderColor?: string;
  className?: string;
  style?: import('react').CSSProperties;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onModeChange?: (mode: InlineEditorMode) => void;
  headerSlot?: (props: InlineEditorHeaderSlotProps) => import('react').ReactNode;
  showInternalToggle?: boolean;
}

export default {} as const;

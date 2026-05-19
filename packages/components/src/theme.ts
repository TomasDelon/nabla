export interface NablaComponentTheme {
  readonly colors: {
    readonly text: string;
    readonly textMuted: string;
    readonly background: string;
    readonly surface: string;
    readonly border: string;
    readonly primary: string;
    readonly primaryMuted: string;
    readonly danger: string;
    readonly warning: string;
    readonly success: string;
    readonly codeBackground: string;
  };
  readonly spacing: {
    readonly xs: string;
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
    readonly xl: string;
  };
  readonly radius: {
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
    readonly full: string;
  };
  readonly typography: {
    readonly fontFamily: string;
    readonly fontFamilyMono: string;
    readonly fontSizeSm: string;
    readonly fontSizeMd: string;
    readonly fontSizeLg: string;
    readonly lineHeight: string;
  };
  readonly borders: {
    readonly width: string;
    readonly style: string;
  };
  readonly shadows: {
    readonly sm: string;
    readonly md: string;
  };
}

export const NABLA_COMPONENT_THEME: NablaComponentTheme = {
  colors: {
    text: "#1a1a1a",
    textMuted: "#6b7280",
    background: "#ffffff",
    surface: "#f9fafb",
    border: "#e5e7eb",
    primary: "#3b82f6",
    primaryMuted: "#dbeafe",
    danger: "#ef4444",
    warning: "#f59e0b",
    success: "#22c55e",
    codeBackground: "#f3f4f6",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    full: "9999px",
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyMono:
      '"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace',
    fontSizeSm: "0.875rem",
    fontSizeMd: "1rem",
    fontSizeLg: "1.25rem",
    lineHeight: "1.6",
  },
  borders: {
    width: "1px",
    style: "solid",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
  },
};

interface Navigation {
  canGoBack?: boolean;
  canGoForward?: boolean;
  back?: () => void;
  forward?: () => void;
}

declare var navigation: Navigation | undefined;

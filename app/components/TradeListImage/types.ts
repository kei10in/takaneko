export interface TradingItemRenderProps {
  path: string;
  status?: string | undefined;
  title: string;
  subtitle: string;
}

export interface TradingItem {
  image: HTMLImageElement;
  status?: HTMLImageElement | undefined;
  title: string;
  subtitle: string;
}

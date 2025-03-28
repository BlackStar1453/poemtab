export type ValueOf<T> = T[keyof T];

export interface MetaItem {
  artist_link: string;
  attribution: string;
  attribution_link: string;
  creator: string;
  image: string;
  link: string;
  source: string;
  title: string;
  width: number;
  height: number;
}

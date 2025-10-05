import { ReininData } from '@ui';
export enum AtomCategory {
  KWA = 'kwa',
  AIM = 'aim',
  KEYWORD = 'keyword',
  ABILITY = 'ability'
}

export interface DetailProps {
  title: string;
}
export interface PyramidDetail {
  width?: number;
  Reinin: Array<ReininData[]>;
  labelColor?: (charge: number) => { bgColor: string; labelColor: string };
}

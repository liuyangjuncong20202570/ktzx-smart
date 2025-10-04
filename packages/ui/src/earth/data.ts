export interface EarthLinkNode {
  typs: string;
  id: string;
  name: string;
  value?: number;
  type?: string;
}

export interface EarthLink {
  source: string;
  target: string;
  value: string;
  type: string;
}

export interface Link {
  source: string | Node | number;
  target: string | Node | number;
  value: number;
  type: string;
}

export interface LinkNode {
  id: string;
  name: string;
  type: string;
  datavalue: string | number;
  ordernum: number;
  group: number;
  degree: number;
  x?: number; // D3 force 计算出的 x 坐标
  y?: number; // D3 force 计算出的 y 坐标
  fx?: number | null; // D3 drag 固定 x
  fy?: number | null; // D3 drag 固定 y
}

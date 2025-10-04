import d3 from '../../utils/d3.ts';

export interface Link {
  source: string | LinkNode | number;
  target: string | LinkNode | number;
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

export const tooltip = d3
  .select('body')
  .append('div')
  .style('position', 'absolute')
  .style('padding', '6px 12px')
  .style('background', 'rgba(0,0,0,0.7)')
  .style('color', '#fff')
  .style('border-radius', '4px')
  .style('pointer-events', 'none')
  .style('font-size', '12px')
  .style('opacity', '0');

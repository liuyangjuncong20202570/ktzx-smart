// D3 工具文件 - 导出常用的 D3 功能
import * as d3 from 'd3';

// 导出整个 D3 库
export { d3 };

// 导出常用的 D3 模块
export const {
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  scaleBand,
  scaleTime,
  axisBottom,
  axisLeft,
  line,
  area,
  arc,
  pie,
  hierarchy,
  tree,
  pack,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  drag,
  zoom,
  transition,
  easeLinear,
  easeCubic,
  interpolate,
  format,
  timeFormat,
  timeParse,
  csv,
  json,
  extent,
  max,
  min,
  mean,
  median,
  range,
  nest
} = d3;

// 常用的颜色方案
export const colorSchemes = {
  category10: d3.schemeCategory10,
  category20: d3.schemeCategory10,
  category20b: d3.schemeCategory10,
  category20c: d3.schemeCategory10,
  blues: d3.schemeBlues,
  greens: d3.schemeGreens,
  reds: d3.schemeReds,
  oranges: d3.schemeOranges,
  purples: d3.schemePurples,
  greys: d3.schemeGreys
};

// 常用的工具函数
export const utils = {
  // 创建 SVG 元素
  createSvg: (container: string | HTMLElement, width: number, height: number) => {
    return d3.select(container).append('svg').attr('width', width).attr('height', height);
  },

  // 创建边距对象
  createMargin: (top = 20, right = 20, bottom = 30, left = 40) => ({
    top,
    right,
    bottom,
    left
  }),

  // 计算内部尺寸
  getInnerDimensions: (width: number, height: number, margin: any) => ({
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom
  }),

  // 创建工具提示
  createTooltip: (className = 'tooltip') => {
    return d3
      .select('body')
      .append('div')
      .attr('class', className)
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none');
  }
};

export default d3;

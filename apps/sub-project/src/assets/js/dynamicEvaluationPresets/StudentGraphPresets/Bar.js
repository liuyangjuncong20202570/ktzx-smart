import { tooltip, toolbox, axisLabel } from '../PublicPresets';
export const barOption = (xData, barData) => ({
  xAxis: {
    type: 'category',
    data: xData,
    axisLabel
  },
  yAxis: {
    type: 'value'
  },
  tooltip: {
    trigger: 'axis', // 触发类型：沿着 x 或 y 轴触发
    axisPointer: {
      type: 'line', // 指针类型为线
      lineStyle: {
        type: 'dashed', // 虚线样式
        color: '#aaa', // 虚线颜色
        width: 1 // 虚线宽度
      }
    }
  },
  toolbox,
  series: [
    {
      name: '评价',
      data: barData,
      type: 'bar'
    }
  ]
});

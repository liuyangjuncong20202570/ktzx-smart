import {
  toolbox,
  graphicLegend,
  timeline,
  tooltip,
  graphicTitle
} from '@/assets/js/dynamicEvaluationPresets/PublicPresets.js';

// TODO:性能优化每一次获取的数据都可以存起来，用timeline组件进行展示，也就是只有最新的数据需要请求拿到，之后的数据都可以存起来

export const radarOption = (
  timelineData = [],
  options,
  indicator,
  showTimeline = true,
  expected = [90, 80, 85, 80, 95, 85, 88, 87, 90, 92]
) => ({
  baseOption: {
    toolbox,
    // 图例
    legend: {
      data: ['期望值', '个人能力值'],
      left: 'center' // 图例水平居中
    },
    // 时间轴
    timeline: { show: showTimeline, ...timeline(timelineData) },
    graphic: {
      ...graphicTitle
    },

    // 提示框
    tooltip: {
      ...tooltip,
      appendToBody: true,
      extraCssText: 'z-index: 9999 !important;'
    },
    // 雷达图配置
    radar: {
      // 雷达图的基本配置
      indicator
    },

    // 初始值
    series: [
      {
        name: '期望值',
        type: 'radar',
        data: [{ value: expected, name: '期望值' }],
        areaStyle: {
          color: 'rgba(0, 0, 255, 0.4)' // 期望值的颜色
        }
      },
      {
        name: '个人能力值',
        type: 'radar',
        data: [], // 初始数据为空，依赖时间轴切换
        areaStyle: {
          color: 'rgba(0, 255, 0, 0.4)' // 个人能力值的颜色
        }
      }
    ]
  },
  // 时间轴上数据展示
  options
});

import {
  toolbox,
  graphicLegend,
  timeline,
  tooltip,
  graphicTitle
} from '@/assets/js/dynamicEvaluationPresets/PublicPresets.js';

function getColorBasedOnValue(value) {
  if (value < 0) return;
  if (value >= 90) {
    return 'rgb(144, 238, 144)';
  } else if (value >= 80) {
    return 'rgb(72, 118, 255)';
  } else if (value >= 70) {
    return 'rgb(255, 255, 0)';
  } else if (value < 70 && value > 0) {
    return 'rgb(251, 158, 148)';
  } else if (value === 0) {
    return 'rgb(207, 207, 207)';
  }
}

function transformToTreeData(wordCloudData) {
  return {
    name: '知识单元',
    value: 0,
    symbol: 'circle',
    symbolSize: 15,
    color: '#fff',
    borderColor: '#b4c7e0',
    label: {
      position: 'right',
      verticalAlign: 'middle',
      align: 'left',
      fontSize: 15
    },
    children: wordCloudData.map((item, index) => ({
      name: item.name,
      value: item.value,
      symbol: 'circle',
      symbolSize: wordCloudData.length >= 8 ? 8 : 15,
      itemStyle: {
        color: '#fff', // 根据 value 动态计算颜色
        borderColor: getColorBasedOnValue(item.value), // 空心圆圈的边框颜色
        borderWidth: 2 // 边框宽度
      },
      label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left',
        fontSize: wordCloudData.length >= 8 ? 8 : 15,
        offset: [10, 0]
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left'
        }
      },
      expandAndCollapse: true,
      initialTreeDepth: 1,
      animationDuration: 550,
      animationDurationUpdate: 750
    }))
  };
}

// response.timeline.map((item, index) => {
//   timelineData.push({
//     value: 1 + index,
//     tooltip: {
//       // 让鼠标悬浮到此项时能够显示 `tooltip`。
//       formatter: function (params) {
//         return '第' + params.name + '次作业';
//       }
//     }
//     // symbol: 'diamond', // 此项的图形的特别设置。
//     // symbolSize: 16 // 此项的图形大小的特别设置。
//   });
// });

export const treeOption = (timelineData, options) => ({
  baseOption: {
    // 文本框（假图例）
    graphic: [{ ...graphicLegend }, { ...graphicTitle, top: 35 }],
    // 时间轴
    timeline: { ...timeline(timelineData), currentIndex: timelineData.length - 1 },

    // 提示框
    tooltip
  },
  options
});

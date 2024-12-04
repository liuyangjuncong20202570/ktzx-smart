import { radarData } from './testdata';

const timelineData = [];
const options = [];
const response = {
  timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-10-03'], // 时间节点
  values: [
    { timeline: '2024-09-01', value: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70] },
    { timeline: '2024-09-09', value: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80] },
    { timeline: '2024-09-17', value: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90] },
    { timeline: '2024-09-25', value: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
    { timeline: '2024-10-03', value: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10] }
  ]
};

// 动态生成 options
response.values.map((item, index) => {
  timelineData.push({
    value: 1 + index,
    tooltip: {
      // 让鼠标悬浮到此项时能够显示 `tooltip`。
      formatter: function (params) {
        return '第' + params.name + '次作业';
      }
    }
    // symbol: 'diamond', // 此项的图形的特别设置。
    // symbolSize: 16 // 此项的图形大小的特别设置。
  });
  options.push({
    // title: { text: `第${1 + index}次作业数据` },
    series: [
      {
        name: '个人能力值',
        type: 'radar',
        data: [{ value: item.value, name: `个人能力值 - 第${1 + index}次作业` }]
      }
    ]
  });
});

export const radarOption = {
  baseOption: {
    toolbox: {
      show: true,
      feature: {
        dataView: {
          readOnly: false,
          title: '数据视图', // 修改按钮的文字为中文
          lang: ['数据视图', '关闭', '刷新'] // 定义数据视图窗口的文字
        },

        restore: {
          title: '还原'
        },
        saveAsImage: {
          title: '保存为图片'
        }
      }
    },
    // 图例
    legend: {
      data: ['期望值', '个人能力值'],
      left: 'center' // 图例水平居中
    },
    // 时间轴
    timeline: {
      axisType: 'category', // 时间轴类型为分类
      autoPlay: false, // 自动播放
      playInterval: 2000, // 自动播放间隔，单位：毫秒
      data: timelineData, // 时间节点
      controlStyle: {
        showPlayBtn: false, // 隐藏播放按钮
        showPrevBtn: true, // 显示上一页按钮
        showNextBtn: true // 显示下一页按钮
      },
      tooltip: {
        trigger: 'item',
        formatter: function (value, index) {
          return '第' + value + '次作业';
        }
      },
      checkpointStyle: {
        symbol: 'diamond', // 设置时间节点符号样式
        symbolSize: 16, // 设置时间节点符号大小
        color: '#b7feb7' // 时间节点颜色
      },
      // 样式设定
      bottom: '-4%'
    },
    graphic: {
      type: 'text',
      left: 'left', // 将文本框放置在右侧
      top: 'top', // 将文本框放置在底部
      style: {
        text: '当前展示第X次作业，已评价X次', // TODO数据产生后，将会存储到store中更好处理
        fill: '#333', // 设置文本颜色
        font: '14px sans-serif', // 设置字体和大小
        align: 'right', // 文本右对齐
        verticalAlign: 'bottom', // 文本底部对齐
        padding: [10, 10, 20, 20] // 可以调整文本框的内边距来防止文本被切割
      }
    },

    // 提示框
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      extraCssText: 'z-index: 9999 !important;'
    },
    // 雷达图配置
    radar: {
      // 雷达图的基本配置
      indicator: radarData.indicator
    },

    // 初始值
    series: [
      {
        name: '期望值',
        type: 'radar',
        data: [{ value: [90, 80, 85, 80, 95, 85, 88, 87, 90, 92], name: '期望值' }],
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
};

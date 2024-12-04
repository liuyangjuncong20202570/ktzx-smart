import { color } from 'echarts';
const timelineData = [];
export const options = [];

export const wordMapPreset = {
  name: '词云',
  type: 'wordCloud',
  shape: 'square',
  left: 'center',
  top: 'center',
  width: '70%',
  height: '80%',
  right: null,
  bottom: null,
  sizeRange: [12, 60],
  gridSize: 20,
  shrinkToFit: false,
  layoutAnimation: true,
  textStyle: {
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    // Color can be a callback function or a color string
    color: function (params) {
      const value = params.value;
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
  },
  emphasis: {
    focus: 'self',

    textStyle: {
      textShadowBlur: 10,
      textShadowColor: '#333'
    }
  }
};

export const response = {
  timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-09-25'],
  wordCloudData: [
    [
      { name: '模块1.1', value: 100 },
      { name: '模块1.2', value: 80 },
      { name: '模块1.3', value: 75 },
      { name: '模块1.4', value: 60 },
      { name: '模块1.5', value: 40 },
      { name: '模块1.6', value: 0 }
    ],
    [
      { name: '模块2.1', value: 90 },
      { name: '模块2.2', value: 70 },
      { name: '模块2.3', value: 50 },
      { name: '模块2.4', value: 30 }
    ],
    [
      { name: '模块3.1', value: 100 },
      { name: '模块3.2', value: 80 },
      { name: '模块3.3', value: 60 },
      { name: '模块3.4', value: 40 }
    ],
    [
      { name: '模块4.1', value: 90 },
      { name: '模块4.2', value: 70 },
      { name: '模块4.3', value: 60 },
      { name: '模块4.4', value: 50 }
    ],
    [
      { name: '模块5.1', value: 90 },
      { name: '模块5.2', value: 70 },
      { name: '模块5.3', value: 60 },
      { name: '模块5.4', value: 50 }
    ]
  ]
};

response.timeline.map((item, index) => {
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
});

response.wordCloudData.map((item, index) => {
  options.push({
    ...wordMapPreset,
    data: item
  });
});

export const wordOption = {
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

  // legend: {
  //   data: ['优', '良', '中', '差'], // 图例中显示的项
  //   orient: 'horizontal',
  //   left: 'left'
  // },
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

  // 提示框
  tooltip: {
    trigger: 'item'
    // appendToBody: true,
    // extraCssText: 'z-index: 9999 !important;'
  },
  series: [
    {
      ...wordMapPreset,
      data: response.wordCloudData[0]
    }
  ]
};

// export const wordOption = {
//   tooltip: {
//     show: true,
//     // 在展示悬停数据时，除了name，value是echarts自动解构，其他必须指定data
//     formatter: function (params) {
//       return `${params.name}: ${params.value}: ${params.data.ability}`;
//     }
//   },
//   legend: {},
//   series: [
//     {
//       type: 'wordCloud',

//       // The shape of the "cloud" to draw. Can be any polar equation represented as a
//       // callback function, or a keyword present. Available presents are circle (default),
//       // cardioid (apple or heart shape curve, the most known polar equation), diamond (
//       // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

//       shape: 'square',

//       // Keep aspect ratio of maskImage or 1:1 for shapes
//       // This option is supported since echarts-wordcloud@2.1.0
//       keepAspect: false,

//       // A silhouette image which the white area will be excluded from drawing texts.
//       // The shape option will continue to apply as the shape of the cloud to grow.

//       // maskImage: maskImage,

//       // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
//       // Default to be put in the center and has 75% x 80% size.

//       left: 'center',
//       top: 'center',
//       width: '70%',
//       height: '80%',
//       right: null,
//       bottom: null,

//       // Text size range which the value in data will be mapped to.
//       // Default to have minimum 12px and maximum 60px size.

//       sizeRange: [12, 60],

//       // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

//       rotationRange: [-90, 90],
//       rotationStep: 45,

//       // size of the grid in pixels for marking the availability of the canvas
//       // the larger the grid size, the bigger the gap between words.

//       gridSize: 20,

//       // set to true to allow word to be drawn partly outside of the canvas.
//       // Allow word bigger than the size of the canvas to be drawn
//       // This option is supported since echarts-wordcloud@2.1.0
//       drawOutOfBound: false,

//       // if the font size is too large for the text to be displayed,
//       // whether to shrink the text. If it is set to false, the text will
//       // not be rendered. If it is set to true, the text will be shrinked.
//       // This option is supported since echarts-wordcloud@2.1.0
//       shrinkToFit: false,

//       // If perform layout animation.
//       // NOTE disable it will lead to UI blocking when there is lots of words.
//       layoutAnimation: true,

//       // Global text style
//       textStyle: {
//         fontFamily: 'sans-serif',
//         fontWeight: 'bold',
//         // Color can be a callback function or a color string
//         color: function () {
//           // Random color
//           return (
//             'rgb(' +
//             [
//               Math.round(Math.random() * 160),
//               Math.round(Math.random() * 160),
//               Math.round(Math.random() * 160)
//             ].join(',') +
//             ')'
//           );
//         }
//       },
//       emphasis: {
//         focus: 'self',

//         textStyle: {
//           textShadowBlur: 10,
//           textShadowColor: '#333'
//         }
//       },

//       // Data is an array. Each array item must have name and value property.
//       data: [
//         { name: '自动化', value: 100, ability: 20 },
//         { name: '控制系统', value: 90 },
//         { name: 'PLC', value: 85 },
//         { name: '传感器', value: 80 },
//         { name: '工业机器人', value: 75 },
//         { name: '过程控制', value: 70 },
//         { name: '嵌入式系统', value: 65 },
//         { name: '自动化设备', value: 60 },
//         { name: '自动化生产线', value: 55 },
//         { name: 'SCADA系统', value: 50 },
//         { name: '机器人技术', value: 45 },
//         { name: '工控系统', value: 40 },
//         { name: '智能制造', value: 35 },
//         { name: '物联网', value: 30 },
//         { name: '机器视觉', value: 25 },
//         { name: '数据采集', value: 20 },
//         { name: '机器学习', value: 15 },
//         { name: '智能控制', value: 10 },
//         { name: '云计算', value: 5 },
//         { name: '大数据', value: 5 }
//       ]
//     }
//   ]
// };

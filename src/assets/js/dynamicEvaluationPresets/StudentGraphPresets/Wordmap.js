import {
  toolbox,
  graphicLegend,
  timeline,
  tooltip,
  graphicTitle
} from '@/assets/js/dynamicEvaluationPresets/PublicPresets.js';

export const wordMapPreset = {
  name: '关键字',
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

export const wordOption = (timelineData, initialData) => ({
  toolbox,
  graphic: [
    {
      ...graphicLegend
    },
    {
      ...graphicTitle,
      top: 35
    }
  ],

  timeline: timeline(timelineData),
  tooltip,

  series: [
    {
      ...wordMapPreset,
      data: initialData
    }
  ]
});

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

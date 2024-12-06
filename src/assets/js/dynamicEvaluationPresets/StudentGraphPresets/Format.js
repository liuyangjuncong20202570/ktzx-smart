// F：第一张表，S；第二张表，T：第三张表
// 学生画像
import { transformToTreeData } from './formatutils';

export const formatStudentGraphchartF = (
  response = {},
  timelineData = [],
  options = [],
  indicators = []
) => {
  // response为后端返回数据，timelineData为时间轴数据，options为配置项
  // 假设response为下所示(实际应该为一个数组，且只含有一次作业数据)
  response = {
    timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-10-03'], // 时间节点
    indicator: [
      { name: '代码解析能力', max: 100 },
      { name: '问题分析能力', max: 100 },
      { name: '诠释理解能力', max: 100 },
      { name: '试图绘图能力', max: 100 },
      { name: '系统联合能力', max: 100 },
      { name: '系统仿真能力', max: 100 },
      { name: '程序设计与编写能力', max: 100 },
      { name: '硬件设计能力', max: 100 },
      { name: '现代工具使用能力', max: 100 },
      { name: '沟通交流能力', max: 100 },
      { name: '概念识别能力', max: 100 },
      { name: '实验设计与分析能力', max: 100 },
      { name: '团队合作能力', max: 100 },
      { name: '器件选择能力', max: 100 }
    ],
    values: [
      { timeline: '2024-09-01', value: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70] },
      { timeline: '2024-09-09', value: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80] },
      { timeline: '2024-09-17', value: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90] },
      { timeline: '2024-09-25', value: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
      { timeline: '2024-10-03', value: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10] }
    ]
  };
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

  response.indicator.map((item, index) => {
    indicators.push(item);
  });
  return { timelineData, options, indicators };
};

export const formatStudentGraphchartS = (
  response = {},
  timelineData = [],
  options = [],
  indicators = []
) => {
  response = {
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
  // 词云需要在组件中手动更新数据
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
  return { response, timelineData };
  // studentGraphStore.setChart(1, timelineData);
};

export const formatStudentGraphchartT = (
  response = {},
  timelineData = [],
  options = [],
  indicators = []
) => {
  response = {
    timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-09-25'],
    treeValues: [
      [
        { name: '模块1.1', value: 100 },
        { name: '模块1.2', value: 80 },
        { name: '模块1.3', value: 75 },
        { name: '模块1.4', value: 60 },
        { name: '模块1.5', value: 40 },
        { name: '模块1.6', value: 0 },
        { name: '模块1.1', value: 100 }
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
  response.treeValues.map((item, index) => {
    timelineData.push({
      value: 1 + index,
      tooltip: {
        // 让鼠标悬浮到此项时能够显示 `tooltip`。
        formatter: function (params) {
          return '第' + params.name + '次作业';
        }
      }
    });
    options.push({
      series: [
        {
          data: [transformToTreeData(response.treeValues[index])] // 根据时间点切换数据
        }
      ]
    });
  });
  return { timelineData, options, response };
};

// 课堂画像
export const formatClassroomGraphchartF = (
  response = {},
  timelineData = [],
  options = [],
  indicators = []
) => {
  // response为后端返回数据，timelineData为时间轴数据，options为配置项
  // 假设response为下所示(实际应该为一个数组，且只含有一次作业数据)
  response = {
    timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-10-03'], // 时间节点
    indicator: [
      { name: '代码解析能力', max: 100 },
      { name: '问题分析能力', max: 100 },
      { name: '诠释理解能力', max: 100 },
      { name: '试图绘图能力', max: 100 },
      { name: '系统联合能力', max: 100 },
      { name: '系统仿真能力', max: 100 },
      { name: '程序设计与编写能力', max: 100 },
      { name: '硬件设计能力', max: 100 },
      { name: '现代工具使用能力', max: 100 },
      { name: '沟通交流能力', max: 100 },
      { name: '概念识别能力', max: 100 },
      { name: '实验设计与分析能力', max: 100 },
      { name: '团队合作能力', max: 100 },
      { name: '器件选择能力', max: 100 }
    ],
    values: [
      { timeline: '2024-09-01', value: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70] },
      { timeline: '2024-09-09', value: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80] },
      { timeline: '2024-09-17', value: [90, 90, 90, 90, 90, 90, 90, 90, 90, 90] },
      { timeline: '2024-09-25', value: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
      { timeline: '2024-10-03', value: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10] }
    ]
  };
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

  response.indicator.map((item, index) => {
    indicators.push(item);
  });
  return { timelineData, options, indicators };
};

export const formatClassroomGraphchartS = (
  response = {},
  timelineData = [],
  options = [],
  indicators = []
) => {
  response = {
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
  // 词云需要在组件中手动更新数据
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
  return { response, timelineData };
  // studentGraphStore.setChart(1, timelineData);
};

export const formatClassroomGraphchartT = (
  response = {},
  timelineData = [],
  options = [],
  indicators = []
) => {
  response = {
    timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-09-25'],
    treeValues: [
      [
        { name: '模块1.1', value: 100 },
        { name: '模块1.2', value: 80 },
        { name: '模块1.3', value: 75 },
        { name: '模块1.4', value: 60 },
        { name: '模块1.5', value: 40 },
        { name: '模块1.6', value: 0 },
        { name: '模块1.1', value: 100 }
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
  response.treeValues.map((item, index) => {
    timelineData.push({
      value: 1 + index,
      tooltip: {
        // 让鼠标悬浮到此项时能够显示 `tooltip`。
        formatter: function (params) {
          return '第' + params.name + '次作业';
        }
      }
    });
    options.push({
      series: [
        {
          data: [transformToTreeData(response.treeValues[index])] // 根据时间点切换数据
        }
      ]
    });
  });
  return { timelineData, options, response };
};
// 学生报告
export const formatStudentReportGraphchartF = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  xData = [],
  values = []
) => {
  // response为后端返回数据，timelineData为时间轴数据，options为配置项
  // 假设response为下所示(实际应该为一个数组，且只含有一次作业数据)
  response = {
    xData: [
      'RTC时钟',
      'BKP寄存器',
      '数字电子钟编程',
      '单片机应用案例',
      'GPIO输入模式',
      'GPIO输出模式',
      '外部中断事件',
      '数码管驱动方法',
      '数码管动态显示',
      'PWM呼吸灯',
      'EERP访问'
    ], // 时间节点

    values: [3, 3, 5, 3, 3, 3, 3, 3, 3, 3, 3]
  };
  xData = response.xData;
  values = response.values;
  return { xData, values };
};

export const formatStudentReportGraphchartS = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  xData = [],
  values = []
) => {
  // response为后端返回数据，timelineData为时间轴数据，options为配置项
  // 假设response为下所示(实际应该为一个数组，且只含有一次作业数据)
  response = {
    indicator: [
      { name: '代码解析能力', max: 100 },
      { name: '问题分析能力', max: 100 },
      { name: '诠释理解能力', max: 100 },
      { name: '试图绘图能力', max: 100 },
      { name: '系统联合能力', max: 100 }
    ],
    values: [{ value: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70] }]
  };
  indicators = response.indicator;
  response.values.map((item, index) => {
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
  return { options, indicators };
};
export const formatStudentReportGraphchartT = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  xData = [],
  values = []
) => {
  // response为后端返回数据，timelineData为时间轴数据，options为配置项
  // 假设response为下所示(实际应该为一个数组，且只含有一次作业数据)
  response = {
    xData: [
      'RTC时钟',
      'BKP寄存器',
      '数字电子钟编程',
      '单片机应用案例',
      'GPIO输入模式',
      'GPIO输出模式',
      '外部中断事件',
      '数码管驱动方法',
      '数码管动态显示',
      'PWM呼吸灯',
      'EERP访问'
    ], // 时间节点

    values: [70, 70, 100, 70, 70, 70, 70, 70, 70, 70, 70]
  };
  xData = response.xData;
  values = response.values;
  return { xData, values };
};

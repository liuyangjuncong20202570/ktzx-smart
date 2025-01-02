// F：第一张表，S；第二张表，T：第三张表
// 学生画像
import { transformToTreeData, rootPreset, childPreset } from './formatutils';
import { wordMapPreset } from './wordmap';

export const formatStudentGraphchartF = (
  response,
  timelineData,
  options,
  indicators,
  num,
  isInit = true
) => {
  const value = [];

  if (isInit) {
    response.map((item, index) => {
      indicators.push({
        name: item.abilityName,
        max: 1
      });
      value.push(item.stuDataValue);
    });
    for (let i = 1; i <= num; i++) {
      timelineData.push({
        value: i,
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
        series: [
          {
            name: '个人能力值',
            type: 'radar',
            data: [{ value: [], name: `个人能力值 - 第${i}次作业` }]
          }
        ]
      });
    }
    options[num - 1].series[0].data[0].value = value;
    // options[0] = {
    //   // title: { text: `第${1 + index}次作业数据` },
    //   series: [
    //     {
    //       name: '个人能力值',
    //       type: 'radar',
    //       data: [{ value, name: `个人能力值 - 第1次作业` }]
    //     }
    //   ]
    // };
  } else {
    response.map((item, index) => {
      value.push(item.stuDataValue);
    });
    options[num - 1].series[0].data[0].value = value;
    // options[num - 1] = {
    //   // title: { text: `第${1 + index}次作业数据` },
    //   series: [
    //     {
    //       name: '个人能力值',
    //       type: 'radar',
    //       data: [{ value, name: `个人能力值 - 第${num}次作业` }]
    //     }
    //   ]
    // };
  }

  // response.indicator.map((item, index) => {
  //   indicators.push(item);
  // });
  return { timelineData, options, indicators };
};

export const formatStudentGraphchartS = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  num,
  isInit = true
) => {
  if (isInit) {
    for (let i = 1; i <= num; i++) {
      timelineData.push({
        value: i,
        tooltip: {
          // 让鼠标悬浮到此项时能够显示 `tooltip`。
          formatter: function (params) {
            return '第' + params.name + '次作业';
          }
        }
      });
      // 第一次初始化配置数组
      options.push([]);
    }
    // 默认展示最新数据
    response.map(item => {
      options[num - 1].push({
        name: item.keywordName,
        value: item.stuDataValue
      });
    });
  } else {
    if (options[num - 1].length === 0) {
      response.map(item => {
        options[num - 1].push({
          name: item.keywordName,
          value: item.stuDataValue
        });
      });
    }
  }

  return { timelineData, options };
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
  response,
  timelineData,
  options,
  indicators,
  // 后续可能直接传递week的总数，根据该总数在方法中进行循环插入timeline
  // ，之后监听timelinechanged方法，实现点击一个节点发送一个请求获取数据
  num,
  isInit = true
) => {
  // 渲染第一次数据
  const value = [];

  if (isInit) {
    response.map((item, index) => {
      indicators.push({
        name: item.abilityName,
        max: 1
      });
      value.push(item.stuDataValue);
    });
    for (let i = 1; i <= num; i++) {
      timelineData.push({
        value: i,
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
            name: '个人能力值',
            type: 'radar',
            data: [{ value: [], name: `个人能力值 - 第${i}次作业` }]
          }
        ]
      });
    }
    options[num - 1].series[0].data[0].value = value;
  } else {
    response.map((item, index) => {
      value.push(item.stuDataValue);
    });
    options[num - 1].series[0].data[0].value = value;
  }

  return { timelineData, options, indicators };
};

export const formatClassroomGraphchartS = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  num,
  isInit = true
) => {
  // 词云需要在组件中手动更新数据
  // 渲染第一次数据
  if (isInit) {
    for (let i = 1; i <= num; i++) {
      timelineData.push({
        value: i,
        tooltip: {
          // 让鼠标悬浮到此项时能够显示 `tooltip`。
          formatter: function (params) {
            return '第' + params.name + '次作业';
          }
        }
      });
      // 第一次初始化配置数组
      // options.push([]);
      options.push({
        series: [
          {
            ...wordMapPreset,
            data: []
          }
        ]
      });
    }
    // 默认展示最新数据
    response.map(item => {
      options[num - 1].series[0].data.push({
        name: item.keywordName,
        value: item.stuDataValue
      });
    });
  } else {
    if (options[num - 1].series[0].data.length === 0) {
      response.map(item => {
        options[num - 1].series[0].data.push({
          name: item.keywordName,
          value: item.stuDataValue
        });
      });
    }
  }

  return { timelineData, options };
};

export const formatClassroomGraphchartT = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  num,
  isInit = true
) => {
  // response = {
  //   timeline: ['2024-09-01', '2024-09-09', '2024-09-17', '2024-09-25', '2024-09-25'],
  //   treeValues: [
  //     {
  //       id: '1707449176-375863ff-35dd-46b4-b889-864b65d0e9dc',
  //       pid: '0',
  //       unitName: '绪论',
  //       orderNum: 1,
  //       type: '1',
  //       dataValue: 0,
  //       stuDataValue: 0,
  //       children: [
  //         {
  //           id: '1707449176-bb8a0c8d-4144-46ba-9f00-287a4993e4b5',
  //           pid: '1707449176-375863ff-35dd-46b4-b889-864b65d0e9dc',
  //           unitName: '基本概念和术语',
  //           orderNum: 1,
  //           type: '1.1',
  //           dataValue: 0,
  //           stuDataValue: 0
  //         }
  //       ]
  //     },
  //     {
  //       id: '1707449176-6494a382-8848-4c82-867f-650fc2da7b06',
  //       pid: '0',
  //       unitName: '排序',
  //       orderNum: 9,
  //       type: '9',
  //       dataValue: 0,
  //       stuDataValue: 0,
  //       children: [
  //         {
  //           id: '1707449176-afe4fc82-b1e0-4a15-9b13-4088174ded0a',
  //           pid: '1707449176-6494a382-8848-4c82-867f-650fc2da7b06',
  //           unitName: '排序的基本概念',
  //           orderNum: 1,
  //           type: '9.1',
  //           dataValue: 0,
  //           stuDataValue: 0
  //         },
  //         {
  //           id: '1707449176-05dc8694-eac6-4922-b153-ab5f170d5612',
  //           pid: '1707449176-6494a382-8848-4c82-867f-650fc2da7b06',
  //           unitName: '插入排序',
  //           orderNum: 2,
  //           type: '9.2',
  //           dataValue: 0,
  //           stuDataValue: 0
  //         },
  //         {
  //           id: '1707449176-0adffc43-8de3-45dd-b1a8-00fdb9bdbb5e',
  //           pid: '1707449176-6494a382-8848-4c82-867f-650fc2da7b06',
  //           unitName: '交换排序',
  //           orderNum: 3,
  //           type: '9.3',
  //           dataValue: 0,
  //           stuDataValue: 0
  //         },
  //         {
  //           id: '1707449176-5f97ceb4-e3bb-44a1-8484-efb1c3630085',
  //           pid: '1707449176-6494a382-8848-4c82-867f-650fc2da7b06',
  //           unitName: '选择排序',
  //           orderNum: 4,
  //           type: '9.4',
  //           dataValue: 0,
  //           stuDataValue: 0
  //         },
  //         {
  //           id: '1707449176-42168efe-e8bc-4a21-bf28-b48ff55f1c7f',
  //           pid: '1707449176-6494a382-8848-4c82-867f-650fc2da7b06',
  //           unitName: '内部排序方法的比较',
  //           orderNum: 5,
  //           type: '9.5',
  //           dataValue: 0,
  //           stuDataValue: 0
  //         }
  //       ]
  //     }
  //   ]
  // };
  // response.treeValues.map((item, index) => {
  //   timelineData.push({
  //     value: 1 + index,
  //     tooltip: {
  //       // 让鼠标悬浮到此项时能够显示 `tooltip`。
  //       formatter: function (params) {
  //         return '第' + params.name + '次作业';
  //       }
  //     }
  //   });
  //   options.push({
  //     series: [
  //       {
  //         data: [transformToTreeData(response.treeValues[index].children)] // 根据时间点切换数据
  //       }
  //     ]
  //   });
  // });
  // return { timelineData, options, response };
  // 渲染第一次数据
  // const value = [];

  if (isInit) {
    // response.map((item, index) => {
    //   indicators.push({
    //     name: item.abilityName,
    //     max: 1
    //   });
    //   value.push(item.stuDataValue);
    // });
    for (let i = 1; i <= num; i++) {
      timelineData.push({
        value: i,
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
            type: 'tree',
            data: []
          }
        ]
      });
    }
    options[num - 1].series[0].data.push({
      name: '知识单元',
      value: 0,
      ...rootPreset,
      children: response.map((item, index) => ({
        name: item.unitName,
        value: item.stuDataValue,
        ...childPreset(item.stuDataValue, response.length),
        children: item.children
          ? item.children.map((iten, index) => ({
              name: iten.unitName,
              value: iten.stuDataValue,
              ...childPreset(iten.stuDataValue, item.children.length)
            }))
          : []
      }))
    });
  } else {
    // response.map((item, index) => {
    //   value.push(item.stuDataValue);
    // });
    options[num - 1].series[0].data.push({
      name: '知识单元',
      value: 0,
      children: response.map((item, index) => ({
        name: item.unitName,
        value: item.stuDataValue,
        ...childPreset(item.stuDataValue),
        children: item.children
          ? item.children.map((iten, index) => ({
              name: iten.unitName,
              value: iten.stuDataValue,
              ...childPreset(iten.stuDataValue)
            }))
          : []
      }))
    });
  }
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

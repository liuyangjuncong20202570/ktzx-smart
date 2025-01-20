// F：第一张表，S；第二张表，T：第三张表
// 学生画像
import { transformToTreeData, rootPreset, childPreset } from './formatutils';
import { wordMapPreset } from '../StudentGraphPresets/Wordmap';

const errorSVG =
  'path://M638.296 461L751.304 348a39.36 39.36 0 0 0 0-55.664L708.16 249.2a39.36 39.36 0 0 0-55.656 0L539.504 362.192 426.488 249.184a39.36 39.36 0 0 0-55.664 0.008l-43.136 43.128a39.352 39.352 0 0 0 0 55.664l113.008 113.008-113.008 113.016a39.352 39.352 0 0 0 0 55.664l43.136 43.152a39.384 39.384 0 0 0 55.664 0l113.008-113.016 113 113.016a39.392 39.392 0 0 0 55.672 0l43.144-43.152a39.376 39.376 0 0 0 0-55.672L638.296 461z M680.336 692.336a47.12 47.12 0 0 1-33.496-13.856L539.504 571.12l-107.36 107.36c-8.944 8.936-20.832 13.856-33.488 13.856s-24.544-4.92-33.488-13.856l-43.144-43.152a47.04 47.04 0 0 1-13.872-33.496c0-12.648 4.928-24.544 13.872-33.488l107.352-107.36-107.344-107.344a47.04 47.04 0 0 1-13.872-33.488c0-12.656 4.928-24.544 13.872-33.496l43.136-43.128a47.024 47.024 0 0 1 33.496-13.872c12.648 0 24.536 4.928 33.48 13.864l107.36 107.36 107.344-107.336c8.936-8.944 20.832-13.864 33.488-13.864s24.544 4.92 33.488 13.864l43.152 43.136a47.416 47.416 0 0 1 0 66.976L649.608 461l107.36 107.344a47.408 47.408 0 0 1 0 66.984l-43.144 43.152a47.088 47.088 0 0 1-33.488 13.856z m-140.832-143.84L658.16 667.168c11.84 11.832 32.512 11.832 44.36 0l43.144-43.152a31.416 31.416 0 0 0 0-44.36L626.984 461l118.664-118.656a31.408 31.408 0 0 0 0-44.352l-43.152-43.136c-11.832-11.84-32.512-11.84-44.344 0L539.504 373.504 420.832 254.84c-11.848-11.848-32.504-11.848-44.352 0.008l-43.136 43.128a31.144 31.144 0 0 0-9.184 22.176c0 8.376 3.264 16.248 9.184 22.168l118.664 118.664-118.664 118.68a31.12 31.12 0 0 0-9.184 22.168c0 8.384 3.264 16.256 9.184 22.176l43.136 43.152c11.84 11.832 32.504 11.832 44.352 0l118.672-118.664z'; // 此项的图形的特别设置。
export const formatStudentGraphchartF = (
  response,
  timelineData,
  options,
  indicators,
  num, //评价总次数
  isInit = true, //是否初始化
  attendEvalList, //参与评价次数
  times
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
    // i表示评价次数，j表示attentEvallist数组下标，其元素是评价次数
    for (let i = 1; i <= num; i++) {
      let isParticipated = false;
      for (let j = 0; j < attendEvalList.length; j++) {
        // 此次该学生已交作业
        if (i === attendEvalList[j]) {
          isParticipated = true;
          break;
        }
      }
      if (isParticipated) {
        //已交作业
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
              data: [{ value: [], name: `个人能力值 - 第${i}次作业` }],
              lineStyle: {
                color: '#42b983' // 折线颜色
              },
              itemStyle: {
                color: '#42b983' // 数据点颜色
              },
              areaStyle: {
                color: '#b1fab6' // 折线图填充区域颜色
              }
            }
          ]
        });
      } else {
        // // 未交作业则插入默认样式数组
        timelineData.push({
          value: i,
          tooltip: {
            // 让鼠标悬浮到此项时能够显示 `tooltip`。
            formatter: function (params) {
              return '第' + params.name + '次作业';
            }
          },
          symbol: errorSVG, // 此项的图形的特别设置。
          symbolSize: 16 // 此项的图形大小的特别设置。
        });
        options.push({
          series: [
            {
              name: '个人能力值',
              type: 'radar',
              data: [{ value: [], name: `个人能力值 - 第${i}次作业` }],
              lineStyle: {
                color: '#42b983' // 折线颜色
              },
              itemStyle: {
                color: '#42b983' // 数据点颜色
              },
              areaStyle: {
                color: '#b1fab6' // 折线图填充区域颜色
              }
            }
          ]
        });
      }
    }
    // 默认将参加评价的最新数据展示
    options[times - 1].series[0].data[0].value = value;
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
};

export const formatStudentGraphchartS = (
  response,
  timelineData,
  options,
  indicators,
  num,
  isInit = true,
  attendEvalList,
  times
) => {
  if (isInit) {
    // 默认展示最新数据
    for (let i = 1; i <= num; i++) {
      let isParticipated = false;
      for (let j = 0; j < attendEvalList.length; j++) {
        // 此次该学生已交作业
        if (i === attendEvalList[j]) {
          isParticipated = true;
          break;
        }
      }
      if (isParticipated) {
        // 已交作业
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
              ...wordMapPreset,
              data: []
            }
          ]
        });
      } else {
        // 未交作业则插入默认样式数组
        timelineData.push({
          value: i,
          tooltip: {
            // 让鼠标悬浮到此项时能够显示 `tooltip`。
            formatter: function (params) {
              return '第' + params.name + '次作业';
            }
          },
          symbol: errorSVG, // 此项的图形的特别设置。
          symbolSize: 16 // 此项的图形大小的特别设置。
        });
        options.push({
          series: [
            {
              ...wordMapPreset,
              data: []
            }
          ]
        });
      }
    }
    response.map(item => {
      options[times - 1].series[0].data.push({
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
};

export const formatStudentGraphchartT = (
  response,
  timelineData,
  options,
  indicators,
  num,
  isInit = true,
  attendEvalList,
  times
) => {
  if (isInit) {
    for (let i = 1; i <= num; i++) {
      let isParticipated = false;
      for (let j = 0; j < attendEvalList.length; j++) {
        // 此次该学生已交作业
        if (i === attendEvalList[j]) {
          isParticipated = true;
          break;
        }
      }
      if (isParticipated) {
        // 已交作业
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
              data: [],
              // 控制默认层级节点
              expandAndCollapse: true,
              initialTreeDepth: 1
            }
          ]
        });
      } else {
        // 未交作业则插入默认样式数组;
        timelineData.push({
          value: i,
          tooltip: {
            // 让鼠标悬浮到此项时能够显示 `tooltip`。
            formatter: function (params) {
              return '第' + params.name + '次作业';
            }
          },
          symbol: errorSVG, // 此项的图形的特别设置。
          symbolSize: 16 // 此项的图形大小的特别设置。
        });
        options.push({
          series: [
            {
              type: 'tree',
              data: [],
              // 控制默认层级节点
              expandAndCollapse: true,
              initialTreeDepth: 1
            }
          ]
        });
      }
    }
    options[times - 1].series[0].data.push({
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
            // console.log(params);
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
};

export const formatClassroomGraphchartT = (
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

      options.push({
        series: [
          {
            type: 'tree',
            data: [],
            // 控制默认层级节点
            expandAndCollapse: true,
            initialTreeDepth: 1
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
  response.map((item, index) => {
    xData.push(item.keywordName);
    values.push(item.stuDataValue);
  });
};

export const formatStudentReportGraphchartS = (
  timelineData = [],
  response = {},
  options = [],
  indicators = [],
  expected = [],
  expectdValue = []
) => {
  for (let i = 0; i < response.length; i++) {
    indicators.push({ name: response[i].abilityName, max: 1 });
    options.push(response[i].stuDataValue);
    expectdValue.push(expected[i].stuDataValue);
  }
};
export const formatStudentReportGraphchartT = (
  response = {},
  timelineData = [],
  options = [],
  indicators = [],
  xData = [],
  values = []
) => {
  response.map((item, index) => {
    xData.push(item.kwaName);
    values.push(item.stuDataValue);
  });
};

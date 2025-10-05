// 树图颜色调整
function getColorBasedOnValue(value) {
  if (value < 0) return;
  if (value >= 0.9) {
    return 'rgb(144, 238, 144)';
  } else if (value >= 0.8) {
    return 'rgb(72, 118, 255)';
  } else if (value >= 0.7) {
    return 'rgb(255, 255, 0)';
  } else if (value < 0.7 && value > 0) {
    return 'rgb(251, 158, 148)';
  } else if (value === 0) {
    return 'rgb(207, 207, 207)';
  }
}

const rootPreset = {
  // name: '知识单元',
  // value: 0,
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
  expandAndCollapse: true,
  initialTreeDepth: 1
};

const childPreset = (value, length) => ({
  symbol: 'circle',
  symbolSize: length >= 8 ? 10 : 10,
  itemStyle: {
    color: '#fff', // 根据 value 动态计算颜色
    borderColor: getColorBasedOnValue(value), // 空心圆圈的边框颜色
    borderWidth: 2 // 边框宽度
  },
  label: {
    position: 'right',
    verticalAlign: 'middle',
    align: 'left',
    fontSize: length >= 8 ? 8 : 10,
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
});

// 树图叶子样式
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
      animationDuration: 550,
      animationDurationUpdate: 750
    }))
  };
}

export { transformToTreeData, rootPreset, childPreset };

export const defaultPreset = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ],
  toolbox: {
    feature: {
      dataView: { show: false } // 这里的按钮不显示，使用自定义按钮触发
    }
  }
};

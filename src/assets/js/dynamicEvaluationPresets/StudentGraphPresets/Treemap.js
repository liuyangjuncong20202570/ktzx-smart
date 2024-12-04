import { data } from './testdata';
export const treeOption = {
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    // textStyle: {
    //   color: '#FFF' // 设置提示框中文字的颜色（例如，番茄红）
    // }
  },
  series: [
    {
      type: 'tree',
      data: [data],
      top: '1%',
      left: '7%',
      bottom: '1%',
      right: '20%',
      symbolSize: 7,
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 9
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left'
        }
      },
      emphasis: {
        focus: 'descendant'
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750
    }
  ]
};

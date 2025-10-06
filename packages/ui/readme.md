# ncut 可视化组件库

## 前言

这是一个基于 vue3 的可视化组件库
目前只有四个组件，希望以后的学弟学妹们可以继续维护这个库，虽然大概率毕业之后这个库就吃灰了，哈哈哈
请保证使用的时候数据已经加载完全

## 组件目录

```typescript
├── src/ # 组件主目录
│ ├── earth/ # 引力球组件
│ └── links/ # 2D 图谱组件
│ └── pyramid/ # 金字塔组件
│ └── pyramid/ # 金字塔群组件
```

## 使用说明

### Earth 组件

类型定义
数据类型可以比定义的字段多但不能少

```typescript
export interface EarthLinkNode {
  typs: string;
  id: string;
  name: string;
  value?: number;
  type?: string;
}

export interface EarthLink {
  source: string;
  target: string;
  value: string;
  type: string;
}
```

props
props 本来还暴露了一个金字塔坐标的，但是没实现 哈哈哈

| 参数名                       | 类型                           | 默认值  | 说明                 |
| ---------------------------- | ------------------------------ | ------- | -------------------- |
| `linkNodes`                  | `EarthLinkNode[]`              | —       | 节点数据列表         |
| `sendlink`                   | `EarthLink[]`                  | —       | 连线数据列表         |
| `nodeColor`                  | `(d: EarthLinkNode) => string` | `null`  | 自定义节点颜色函数   |
| `nodeRadical`                | `(d: EarthLinkNode) => number` | `null`  | 自定义节点半径函数   |
| `utilBoxShow`                | `boolean`                      | `true`  | 是否显示工具箱       |
| `rotateConfig.radius`        | `number`                       | `800`   | 相机距离图中心的半径 |
| `rotateConfig.rotationSpeed` | `number`                       | `0.002` | 自动旋转速度         |
| `rotateConfig.center.x`      | `number`                       | `0`     | 图中心 X 坐标        |
| `rotateConfig.center.y`      | `number`                       | `0`     | 图中心 Y 坐标        |
| `rotateConfig.center.z`      | `number`                       | `0`     | 图中心 Z 坐标        |

事件

| 事件名        | 参数                                                                        | 返回值 | 说明                                                   |
| ------------- | --------------------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| `onNodeClick` | `(e: 'onNodeClick', node: EarthLinkNode, prevPos: number, currPos: number)` | `void` | 当节点被点击时触发，返回被点击节点及点击前后的位置信息 |
| `onNodeDrag`  | `(e: 'onNodeDrag', node: EarthLinkNode, prevPos: number, currPos: number)`  | `void` | 当节点被拖拽时触发，返回被拖拽节点及拖拽前后的位置信息 |

### Links 组件

类型定义
该组件同时暴露了一个 tooltip 可供绘制 label

```typescript
export interface Link {
  source: string | LinkNode | number;
  target: string | LinkNode | number;
  value: number;
  type: string;
}

export interface LinkNode {
  id: string;
  name: string;
  type: string;
  datavalue: string | number;
  ordernum: number;
  group: number;
  degree: number;
  x?: number; // D3 force 计算出的 x 坐标
  y?: number; // D3 force 计算出的 y 坐标
  fx?: number | null; // D3 drag 固定 x
  fy?: number | null; // D3 drag 固定 y
}
```

props

| 参数名      | 类型         | 说明         |
| ----------- | ------------ | ------------ |
| `title`     | `string`     | 图表标题     |
| `sendlink`  | `Link[]`     | 连线数据列表 |
| `linkNodes` | `LinkNode[]` | 节点数据列表 |

事件

| 事件名      | 参数                                                   | 返回值 | 说明                                                 |
| ----------- | ------------------------------------------------------ | ------ | ---------------------------------------------------- |
| `nodeClick` | `(e: 'nodeClick', node: LinkNode, event?: MouseEvent)` | `void` | 当节点被点击时触发，返回当前点击节点及鼠标事件对象   |
| `nodeHover` | `(e: 'nodeHover', node: LinkNode, event?: MouseEvent)` | `void` | 当鼠标悬停在节点上时触发，返回当前悬停节点及事件对象 |
| `nodeMove`  | `(e: 'nodeMove', node: LinkNode, event?: MouseEvent)`  | `void` | 当鼠标在节点上移动时触发，返回当前节点及事件对象     |
| `nodeOut`   | `(e: 'nodeOut', node: LinkNode, event?: MouseEvent)`   | `void` | 当鼠标移出节点时触发，返回当前节点及事件对象         |

### pyramid/pyramidcombo 组件

类型定义

```typescript
export interface ReininData {
  num: number;
  label: string;
  type: number;
}
```

props

| 参数名       | 类型                                                          | 默认值 | 说明                                                 |
| ------------ | ------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| `width`      | `number`                                                      | —      | 图表宽度，可选，单位 px                              |
| `Reinin`     | `ReininData[]`                                                | —      | 图数据列表                                           |
| `polLength`  | `number`                                                      | —      | 极径长度，用于控制图表半径或尺寸                     |
| `labelColor` | `(charge: number) => { bgColor: string; labelColor: string }` | `null` | 自定义标签颜色函数，根据 charge 返回背景色和文字颜色 |

import { Link, LinkNode } from '../data';

export const Nodes: LinkNode[] = [
  {
    id: '1707449176-e9b25fd0-cae6-4285-9bd8-bc3d79143146',
    name: '第一章 计算机基础知识',
    type: '1',
    datavalue: 0,
    ordernum: 1,
    group: 1,
    degree: 3
  },
  {
    id: '1707449176-41e0e7c9-43d9-4659-8321-8dd7f488068f',
    name: '第二章 计算机基础知识',
    type: '1',
    datavalue: 0,
    ordernum: 1,
    group: 1,
    degree: 3
  },
  {
    id: '1707449176-9a07c610-c645-4101-8dbe-e242a31e8e0c',
    name: '第三章 计算机基础知识',
    type: '1',
    datavalue: 0,
    ordernum: 1,
    group: 1,
    degree: 3
  },
  {
    id: '1707449176-95645b31-7d7a-44cf-a8be-4afc3713f424',
    name: '第三章 计算机基础知识',
    type: '1',
    datavalue: 0,
    ordernum: 1,
    group: 1,
    degree: 3
  }
];

export const Links: Link[] = [
  {
    source: '1707449176-41e0e7c9-43d9-4659-8321-8dd7f488068f',
    target: '1707449176-e9b25fd0-cae6-4285-9bd8-bc3d79143146',
    value: 1,
    type: `Dumbledore's Army`
  },
  {
    source: '1707449176-95645b31-7d7a-44cf-a8be-4afc3713f424',
    target: '1707449176-e9b25fd0-cae6-4285-9bd8-bc3d79143146',
    value: 2,
    type: 'Gryffindor'
  },
  {
    source: '1707449176-9a07c610-c645-4101-8dbe-e242a31e8e0c',
    target: '1707449176-e9b25fd0-cae6-4285-9bd8-bc3d79143146',
    value: 1,
    type: 'Duelling Club'
  }
];

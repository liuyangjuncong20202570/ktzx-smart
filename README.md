# 智慧教学可视化平台

本项目是一个基于 **Vite + TypeScript + Pinia + PNPM Monorepo** 架构的前端可视化系统，用于实现教学数据可视化、能力模型展示与学生画像分析等功能。

---

## 技术栈

| 分类              | 技术                                                       |
| ----------------- | ---------------------------------------------------------- |
| 前端框架          | [Vue 3](https://vuejs.org/)                                |
| 构建工具          | [Vite](https://vitejs.dev/)                                |
| 包管理            | [PNPM](https://pnpm.io/)                                   |
| 状态管理          | [Pinia](https://pinia.vuejs.org/)                          |
| 语言              | JavaScript / [TypeScript](https://www.typescriptlang.org/) |
| Monorepo 管理     | PNPM Workspace                                             |
| UI 组件库（可选） | Ant Design Vue / Element Plus                              |
| 数据可视化        | ECharts + echarts-extension-amap + d3.js + three.js        |

---

## 项目结构

```js
├── apps/ # 各子项目（App 层）
│ ├── main-project/ # 主系统
│ └── sub-project/ # 子系统
│
├── packages/ # 公共模块（Package 层）
│ ├── ui/ # 自定义 UI 组件库（3D可视化组件 等）
│   ├── utils/ # 工具函数库（请求封装、通用方法）
│
├── .pnpm-workspace.yaml # PNPM 工作区配置
├── package.json # 根目录依赖与统一命令定义
├── .npmrc # npm配置文件
├── README.md # 项目说明文件
└── pnpm-lock.json # 依赖锁文件
```

---

## 环境要求

```json
 "packageManager": "pnpm@10.15.0",
  "engines": {
    "node": ">=20",
    "pnpm": ">=8.0.0"
  },
  "pnpm": {
    "overrides": {
      "vue": "3.3.11",
      "vue-router": "4.2.5",
      "pinia": "2.1.7",
      "vite": "5.0.8",
      "@vitejs/plugin-legacy": "5.3.0",
      "@vitejs/plugin-vue": "4.5.2",
      "@vitejs/plugin-vue-jsx": "5.1.1",
      "three": "0.171.0"
    }
  },
  "devDependencies": {
    "@vue/runtime-core": "^3.5.22",
    "typescript": "^5.9.3",
    "vue": "^3.3.11"
  }
```

> 建议使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node 版本，避免兼容性问题。

---

## 启动项目

### 克隆项目

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

### 安装依赖

在项目根目录下运行：

```bash
pnpm install
```

如有新依赖安装，请在目标项目文件下运行（不要在项目根目录下安装！）

```bash
pnpm add package-name
```

### 启动开发环境

```bash
cd apps/main-project
pnpm run dev
```

### 构建生产包与部署

此步骤请参考语雀文档([https://www.yuque.com/kabuer/ohs3ct/nyq5h7yq3yielrlt])
npm 替换为 pnpm 即可

## ncut可视化组件库

### 使用
```bash
npm i @ncut/visualize-comp
```

### 地址
https://www.npmjs.com/package/@ncut/visualize-comp

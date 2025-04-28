export default {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 1920, // 设计稿的宽度
      viewportHeight: 1080, // 可选，设计稿的高度，通常如果不需要，可以不设置
      unitPrecision: 5, // 转换后的精度，默认为5
      propList: ['*'], // 可以转换的属性，* 代表所有属性
      // minPixelValue: 1, // 小于或等于1px的单位不转换
      mediaQuery: false // 是否允许在媒体查询中转换px，默认为false
      // exclude: /node_modules/ // 排除 node_modules 中的文件
    }
  }
};

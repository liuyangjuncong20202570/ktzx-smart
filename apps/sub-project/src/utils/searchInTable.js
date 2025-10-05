// searchTable.js
// 这个函数接受原始数据数组（dataArray），搜索关键字（keyword）和要搜索的列名（columnName）
// 并返回过滤后的数据数组
function searchInTable(dataArray, keyword, columnName) {
  // 如果没有提供搜索关键字，返回原始数据数组
  if (!keyword.trim()) {
    return dataArray;
  }

  // 使用提供的列名和关键字过滤数据数组
  const filteredData = dataArray?.filter(item => {
    const itemValue = item[columnName]?.toString().toLowerCase();
    return itemValue.includes(keyword.toLowerCase());
  });

  return filteredData;
}

// 导出这个函数，以便在其他文件中使用
export { searchInTable };

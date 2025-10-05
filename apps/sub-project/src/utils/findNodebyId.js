export const findNodebyId = (data, targetId) => {
  for (const item of data) {
    // 如果当前对象的 id 匹配，则返回该对象
    if (item.id === targetId) {
      return item;
    }

    // 如果存在 children 数组，则递归查找
    if (item.children ? item.children : item.studentDtos) {
      const result = findNodebyId(item.children || item.studentDtos, targetId);
      if (result) {
        return result;
      }
    }
  }
  // 如果没有找到，返回 null
  return null;
};

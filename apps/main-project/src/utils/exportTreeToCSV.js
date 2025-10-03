function exportTreeToCSV(treeData, columns) {
    // CSV列标题
    const csvRows = [
        columns.map(col => `"${col.label}"`).join(',')  // CSV头部
    ];

    // 递归遍历每个节点及其子节点
    const traverse = (node) => {
        // 为当前节点创建一行
        const row = columns.map(col => {
            let value = node[col.prop];
            if (value === null || value === undefined) {
                value = '';  // 将null或undefined替换为空字符串
            } else {
                // 显式地将value转换为字符串，以防它是其他类型
                value = String(value);
                // 转义所有双引号以确保CSV格式正确
                value = value.replace(/"/g, '""');
            }
            return `"${value}"`;  // 确保每个值都被双引号包围
        });
        csvRows.push(row.join(','));

        // 如果有子节点，递归遍历子节点
        if (node.children) {
            node.children.forEach(child => traverse(child));
        }
    };

    // 遍历树形数据的根节点
    treeData.forEach(rootNode => traverse(rootNode));

    // 将所有CSV行合并为一个字符串，然后添加UTF-8 BOM
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tree_data.csv';  // 文件名
    link.click();
}

export { exportTreeToCSV };

function exportTableToCSV(tableData, columns) {
    // CSV列标题
    const csvRows = [
        ['"序号"'].concat(columns.map(col => `"${col.label}"`)).join(',')  // CSV头部，添加了序号列
    ];

    // 遍历表格数据，转换为CSV格式，并为每行添加序号
    tableData.forEach((row, index) => {
        const values = [index + 1];  // 序号列，从1开始计数
        columns.forEach(col => {
            // 检查值是否为null或undefined，是则替换为空字符串
            let value = row[col.prop];
            if (value === null || value === undefined) {
                value = '';  // 将null或undefined替换为空字符串
            }
            // 将值转换为字符串并进行CSV格式化
            values.push(`"${String(value).replace(/"/g, '""')}"`);  // 处理可能的引号，以确保CSV格式正确
        });
        csvRows.push(values.join(','));  // 将序号和其他列数据合并
    });

    // 将所有CSV行合并为一个字符串，然后添加UTF-8 BOM
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data.csv';  // 文件名
    link.click();
}

export { exportTableToCSV };

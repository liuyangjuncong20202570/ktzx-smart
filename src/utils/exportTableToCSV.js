function exportTableToCSV(tableData, columns) {
    // 生成CSV列标题，序号作为第一列
    const csvHeader = ['"序号"'].concat(columns.map(col => `"${col.label}"`)).join(',');
    const csvRows = [csvHeader];  // CSV头部

    // 遍历表格数据，生成CSV格式的行
    tableData.forEach((row, index) => {
        // 第一列为序号列，从1开始计数
        const rowValues = [`"${index + 1}"`];
        columns.forEach(col => {
            let cellValue = row[col.prop];

            // 处理数组数据
            if (col.isArray && Array.isArray(cellValue)) {
                cellValue = cellValue.map(item => item[col.arrayProp]).join(';');
            }

            // 如果值是null或undefined，替换为空字符串，处理引号以确保CSV格式正确
            cellValue = cellValue === null || cellValue === undefined ? '' : String(cellValue).replace(/"/g, '""');

            // 将处理后的值加入到rowValues中
            rowValues.push(`"${cellValue}"`);
        });

        // 将序号和其他列数据合并，添加到csvRows数组中
        csvRows.push(rowValues.join(','));
    });

    // 转换行数组为CSV字符串并添加UTF-8的BOM
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // 创建一个隐藏的下载链接并触发下载
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exported_table_data.csv';  // 设定下载文件名
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 导出函数以便在其他地方使用
export { exportTableToCSV };

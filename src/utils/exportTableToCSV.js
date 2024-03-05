function exportTableToCSV(tableData, columns) {
    // CSV列标题
    const csvRows = [
        columns.map(col => `"${col.label}"`).join(',')  // CSV头部
    ];

    // 遍历表格数据，转换为CSV格式
    tableData.forEach(row => {
        const values = columns.map(col => {
            const value = row[col.prop];
            // 处理数据，确保CSV格式正确
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    });

    // 将所有CSV行合并为一个字符串，然后添加UTF-8 BOM
    const csvString = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table-data.csv';  // 文件名
    link.click();
}

export { exportTableToCSV };

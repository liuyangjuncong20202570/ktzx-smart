<template>
    <!-- <div id="container" style="height: 100%;"></div> -->
    <SheetComponent :dataCfg="dataCfg" :options="options" />
</template>

<script setup lang="ts">
import { CustomTreeNode, TableSheet, S2DataConfig, S2Options, ThemeCfg, ResizeType } from '@antv/s2';
import "@antv/s2-vue/dist/style.min.css";
import {
    SheetComponent,
    SheetComponentOptions,
    type SheetComponentsProps,
} from '@antv/s2-vue';
import { onMounted, ref } from 'vue';
import request from '../../utils/request';
import _ from 'lodash';
import { ElMessage } from 'element-plus';

const courseid = '2c918af681fa6ea7018209a505c30672';

const data = ref([]);

const s2DataConfig: S2DataConfig = ref();
const s2Options: S2Options = ref();
const onDataCellEditStart: SheetComponentsProps['onDataCellEditStart'] = ref();
const onDataCellEditEnd: SheetComponentsProps['onDataCellEditEnd'] = ref();

const tableSheetMultipleColumns: CustomTreeNode[] = ref([
    {
        field: 'target',
        title: '课程目标',
        children: [],
    },
]);

const getData = (async () => {
    try {
        const res = await request.evaluation.get(`/evaluation/assessmentPlan/getAssessmentTable?courseid=${courseid}`);
        if (res.code === 200) {
            let info = res.data;
            console.log(info);
            initialize(info);
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('获取考核方案失败', error);
    }
})

onMounted(async () => {
    await getData();

    const container = document.getElementById('container');
    s2DataConfig.value = {
        fields: {
            columns: tableSheetMultipleColumns.value,
        },
        data: data.value,
        // 自定义节点默认使用 `title` 作为展示名, 也可以通过 meta 来统一进行格式化
        meta: [],
    };

    const s2Palette: ThemeCfg['palette'] = {
        basicColors: [
            '#787878',  // 表头头字颜色
            'white',     // 奇数行数据单元格的背景色
            '#eaeaea',     // 悬浮在数据单元格上时的背景颜色
            '#efefef',    // 表头单元格背景颜色
            'transparent',    // 列头光标悬浮时的背景色
            '000000',
            '000000',
            '',    // 表头单元格宽高调整线颜色
            '#f9f9f9',    // 偶数行数据单元格的背景色
            '#dddddd',      // 数据单元格的边框颜色
            '#dddddd',    // 表头头边框颜色
            '000000',
            '#666666',      // 数据表部分与列头交接处的颜色
            '#000000',      // 数据单元格字体颜色
            '',     // 悬浮在单元格上时的边框颜色
        ],
        // ---------- semantic colors ----------
        semanticColors: {
            red: '#FF4D4F',
            green: '#29A294',
        },
    };

    s2Options.value = {
        width: container.clientWidth,
        height: container.clientHeight,
        interaction: {
            // 行列联动高亮
            hoverHighlight: false,
            selectedCellHighlight: false,
            // 高亮选中单元格
            selectedCellsSpotlight: false,
            // 多选 (按住 Ctrl/Command), 默认开启
            multiSelection: false,
            // 区间多选 (按住 Shift), 默认开启
            rangeSelection: false,
            // 关闭圈选
            brushSelection: false,
            // 行高调整时，影响全部行 (可选 'all' | 'current' | 'selected')
            rowResizeType: ResizeType.ALL,
        },
        style: {
            // 列头宽度始终和数值单元格一致
            dataCell: {
                // 如果配置了列宽, 则该配置无效
                // width: 200,
                // 如果配置了行高, 则该配置无效
                // height: 50,
            },
            // 列头宽高配置 (优先级: colCell.widthByField > colCell.width > dataCell.width)
            colCell: {
                // width: 200,
                height: 40,
                // widthByField: {
                //     // 推荐: 特定维度 (如: 城市)
                //     city: 100,
                //     // 不推荐: 特定维值 (明细表场景下等同于配置特定维度)
                //     'root[&]target': 80,
                // },
            },
            // 行高配置 (优先级: rowCell.heightByField > rowCell.height > dataCell.height)
            rowCell: {
                // 1. 设置行高
                height: 50,
                // 2. 每一行根据行索引单独设置 (从 0 开始)
                // heightByField: {
                //     '0': 40,
                //     '1': 130,
                //     '3': 60,
                //     '10': 80,
                //     '15': 20,
                // },
            },
            cellCfg: {
                textAlign: 'center'
            }
        },
    };

    onDataCellEditStart.value = (
        meta,
        cell,
    ) => {
        console.log('onDataCellEditStart:', meta, cell);
    };

    onDataCellEditEnd.value = (
        meta,
        cell,
    ) => {
        console.log('onDataCellEditEnd:', meta, cell);
    };

    // reactDOMClient
    //     .createRoot(document.getElementById('container'))
    //     .render(
    //         <SheetComponent
    //       dataCfg={ s2DataConfig }
    //       options = { s2Options }
    //       sheetType = "editable"
    //       onDataCellEditStart = { onDataCellEditStart }
    //       onDataCellEditEnd = { onDataCellEditEnd }
    //         />,
    //     );

    const s2 = new TableSheet(container, s2DataConfig.value, s2Options);
    s2.setTheme({
        // 宽高调整 (热区, 参考线)
        // resizeArea: {
        //     // 热区大小, 背景色
        //     size: 2,
        //     background: 'transparent',
        //     backgroundOpacity: 0,

        //     // 参考线
        //     guideLineColor: '#bbbbbb',
        //     guideLineDash: [0, 0],
        // },
        colCell: {
            cell: {
                interactionState: {
                    // 悬停聚焦: 关闭悬停单元格时出现的 "黑色边框"
                    hoverFocus: {
                        // 边框设置为透明
                        borderColor: 'transparent',
                        backgroundColor: '',
                        // 或者边框透明度设置为 0
                        // borderOpacity: 0
                    },
                    // 十字悬停
                    hover: {
                        backgroundOpacity: 0,
                        borderColor: 'transparent',
                        borderOpacity: 0,
                    },
                    // 选中背景色/边框
                    selected: {
                        backgroundColor: '',
                    },
                },
            },
        },
        // 数值单元格 (其他单元格同理)
        dataCell: {
            cell: {
                interactionState: {
                    // 悬停聚焦: 关闭悬停单元格时出现的 "黑色边框"
                    hoverFocus: {
                        // 边框设置为透明
                        borderColor: 'transparent',
                        backgroundColor: '',
                        // 或者边框透明度设置为 0
                        // borderOpacity: 0
                    },
                    // 十字悬停
                    hover: {
                        backgroundOpacity: 0,
                        borderColor: 'transparent',
                        borderOpacity: 0,
                    },
                    // 选中背景色/边框
                    selected: {
                        backgroundColor: '',
                    },
                },
            },
        },
    });
    s2.setThemeCfg({
        palette: s2Palette,
    });

    await s2.render();
});

const initialize = (async (info: Array) => {
    createColHeader(_.cloneDeep(info.head));    // 处理表头

    info.items.forEach((item) => {      // 处理数据单元格
        item.target = item.name;
    })
    data.value = _.cloneDeep(info.items);
});

const createColHeader = (head: Array, floor = 0) => {
    head.forEach((node) => {
        node.title = node.itemName;
        node.field = node.id;
        if (node.children && node.children.length > 0) createColHeader(node.children, floor + 1);
    })
    if (!floor) {
        tableSheetMultipleColumns.value = tableSheetMultipleColumns.value.concat(head);
    }
};

</script>

<script scoped>
</script>
<template>
    <el-container style="height: 92vh;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;" @click="exportData">导出到Excel</el-button>
            <el-button type="danger" @click="changeTreeExpand" style="margin-left: 0.8vw;">全部展开/关闭</el-button>
            <el-button type="success" style="margin-left: 0.8vw;" >保存</el-button>
        </el-header>

        <el-main style="padding: 0;">  
            <div style="height: 25px; display: flex; justify-content: space-between; flex: auto; text-align: center;
                background-color: whitesmoke;">
                <div style="width: 390px; color: gray">名称</div>
                <div style="width: 59vw;">
                    <div style="display: flex; flex: auto; justify-content: space-between;">
                        <div style="width: 150px; border-right: 1px solid #bbbbbb; border-left: 1px solid #bbbbbb;
                            color: gray">系数</div>
                        <div style="width: calc(59vw - 150px); color: gray;">备注</div>
                    </div>
                </div>
            </div>

            <div class="tree-container" style="height: calc(100% - 25px); overflow:auto;">
                <el-tree 
                        :data="treeData"
                        draggable
                        node-key=""
                        :props="defaultProps"
                        :expand-on-click-node="true"
                        ref="nodeExpand"
                        :default-expand-all="expandAll"
                        @node-drag-start=""
                        @node-drag-end=""
                        @node-contextmenu=""
                         >
                    <template #default="{ node }">
                        <div style="display: flex; justify-content: space-between; flex: auto; text-align: left;">
                            <el-popover :visible="node.data.popVisible" placement="right"
                                popper-style="background-color: rgba(255, 255, 255, 0.5)">
                                <el-button style="margin-top: 6px; width: 100%;" type="success" plain round
                                    @click="editNode(node.data)">编辑</el-button><br>
                                <el-button style="margin-top: 6px; width: 100%;" type="primary" plain round
                                    @click="addSiblingNode(node.data)">同级新增</el-button><br>
                                <el-button style="margin-top: 6px; width: 100%;" type="primary" plain round
                                    @click="addChildNode(node.data)">下级新增</el-button><br>
                                <el-button style="margin-top: 6px; width: 100%;" type="danger" plain round
                                    @click="confirmDeleteNodes(node.data)">删除</el-button>
                                <template #reference>
                                    <el-input v-if="node.data.inputVisible" v-model="node.data.tempData"
                                        @blur="blurInput(node.data)" placeholder="请输入节点名称" @contextmenu.stop draggable="false"
                                        style="height:25px; width: 200px;"></el-input>
                                    <div style="width: auto;">
                                        <el-icon v-if="node.data.children" color="orange"><Folder /></el-icon>
                                        <el-icon v-else color="dodgerblue"><Document /></el-icon>
                                        {{ node.data.name }}
                                    </div>
                                </template>
                            </el-popover>

                            <div style="width: 59vw;">
                                <div style="display: flex; flex: auto; justify-content: space-between;">
                                    <div style="width: 150px; text-align: center;">
                                        {{ node.data.datavalue }}
                                    </div>
                                    <div class="overflow-text" v-bind:title="node.data.remark">
                                        {{ node.data.remark }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-tree>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import { Folder, Document } from '@element-plus/icons-vue';
import { ref } from 'vue';


const defaultProps = {
  children: 'children',
  label: 'name',
}

const treeData = ref([
    {
        id: '',
        name: '认知类型',
        datavalue: '0.00',
        remark: '基于布鲁姆教育目标分类学的六个层次划分，对每个层次进行了一定程度的细化11111111111111111',
        children: [
            {
                id: '',
                name: '记忆层次',
                datavalue: '0.00',
                remark: '111',
                children: [
                    {
                        id: '',
                        name: '识记再现能力',
                        datavalue: '1.22',
                        remark: '09樱花怒放',
                        children: [
                            {
                                id: '',
                                name: '回忆再认能力',
                                datavalue: '5.55',
                                remark: '1234',
                            },
                            {
                                id: '',
                                name: '再现复述能力',
                                datavalue: '0.00',
                                remark: '',
                            }
                        ]
                    }
                ]
            },
            {
                id: '',
                name: '理解层次',
                datavalue: '0.00',
                remark: '2222',
                children: [
                    {
                        id: '',
                        name: '概念识辨能力',
                        datavalue: '0.00',
                        remark: '6666',
                    },
                    {
                        id: '',
                        name: '识图绘图能力',
                        datavalue: '0.00',
                        remark: 'dwvcwed',
                    },
                    {
                        id: '',
                        name: '诠释理解能力',
                        datavalue: '0.00',
                        remark: 'aevgrefbara'
                    }
                ]
            },
            {
                id: '',
                name: '应用层次',
                datavalue: '0.00',
                remark: '豆腐刺尾u城内外才弄完纽黑文你好',
                children: [
                    {
                        id: '',
                        name: '直接应用能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                    {
                        id: '',
                        name: '数学计算能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                    {
                        id: '',
                        name: '数模转化能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                    {
                        id: '',
                        name: '综合运用能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                ]
            }
        ]
    },
    {
        id: '',
        name: '技术类型',
        datavalue: '0.99',
        remark: '1我的绯闻iojsdjwdcwqqwsd',
        children: [
            {
                id: '',
                name: '文献检索能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
            {
                id: '',
                name: '工具使用能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
            {
                id: '',
                name: '设备操作能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
            {
                id: '',
                name: '程序实现能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
        ]
    },
    {
        id: '',
        name: '认知类型',
        datavalue: '0.00',
        remark: '基于布鲁姆教育目标分类学的六个层次划分，对每个层次进行了一定程度的细化11111111111111111',
        children: [
            {
                id: '',
                name: '记忆层次',
                datavalue: '0.00',
                remark: '111',
                children: [
                    {
                        id: '',
                        name: '识记再现能力',
                        datavalue: '1.22',
                        remark: '09樱花怒放',
                        children: [
                            {
                                id: '',
                                name: '回忆再认能力',
                                datavalue: '5.55',
                                remark: '1234',
                            },
                            {
                                id: '',
                                name: '再现复述能力',
                                datavalue: '0.00',
                                remark: '',
                            }
                        ]
                    }
                ]
            },
            {
                id: '',
                name: '理解层次',
                datavalue: '0.00',
                remark: '2222',
                children: [
                    {
                        id: '',
                        name: '概念识辨能力',
                        datavalue: '0.00',
                        remark: '6666',
                    },
                    {
                        id: '',
                        name: '识图绘图能力',
                        datavalue: '0.00',
                        remark: 'dwvcwed',
                    },
                    {
                        id: '',
                        name: '诠释理解能力',
                        datavalue: '0.00',
                        remark: 'aevgrefbara'
                    }
                ]
            },
            {
                id: '',
                name: '应用层次',
                datavalue: '0.00',
                remark: '豆腐刺尾u城内外才弄完纽黑文你好',
                children: [
                    {
                        id: '',
                        name: '直接应用能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                    {
                        id: '',
                        name: '数学计算能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                    {
                        id: '',
                        name: '数模转化能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                    {
                        id: '',
                        name: '综合运用能力',
                        datavalue: '0.88',
                        remark: 'dwwqfewfewf',
                    },
                ]
            }
        ]
    },
    {
        id: '',
        name: '技术类型',
        datavalue: '0.99',
        remark: '1我的绯闻iojsdjwdcwqqwsd',
        children: [
            {
                id: '',
                name: '文献检索能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
            {
                id: '',
                name: '工具使用能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
            {
                id: '',
                name: '设备操作能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
            {
                id: '',
                name: '程序实现能力',
                datavalue: '0.88',
                remark: 'dwwqfewfewf',
            },
        ]
    }
])

const nodeExpand = ref(null);

const expandAll = ref(false);

//展开所有或收起所有
const changeTreeExpand = () => {
    expandAll.value = !expandAll.value;
    for (let i = 0; i < nodeExpand.value.store._getAllNodes().length; i++) {
        nodeExpand.value.store._getAllNodes()[i].expanded = expandAll.value;
    }
}

</script>

<style scoped>

.overflow-text {
    width: calc(59vw - 150px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 去掉滚动条 */
.tree-container::-webkit-scrollbar {	/* 针对Chrome, Safari, Edge, 和 Opera */
	display: none;
}

.element {		/* 针对Firefox */
  scrollbar-width: none;
}

.element {		/* 针对IE和Edge旧版本 */
  -ms-overflow-style: none;
}
/*************/

</style>
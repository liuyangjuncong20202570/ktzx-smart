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
                        :expand-on-click-node="false"
                        ref="nodeExpand"
                        :default-expand-all="expandAll"
                        @node-drag-start=""
                        @node-drag-end=""
                        @node-contextmenu="clickNode"
                         >
                    <template #default="{ node }">
                        <div style="display: flex; justify-content: space-between; flex: auto; text-align: left;">
                            <el-popover :visible="node.data.popVisible" placement="right"
                                popper-style="background-color: rgba(255, 255, 255, 0.5)">
                                <el-button style="margin-top: 6px; width: 100%;" type="primary" plain round
                                    @click="addSiblingNode(node.data)">同级新增</el-button><br>
                                <el-button style="margin-top: 6px; width: 100%;" type="primary" plain round
                                    @click="addChildNode(node.data)">下级新增</el-button><br>
                                <el-button style="margin-top: 6px; width: 100%;" type="danger" plain round
                                    @click="confirmDeleteNodes(node.data)">删除</el-button>
                                <template #reference>
                                    <el-input v-if="node.data.editingName" v-model="node.data.name"
                                        @blur="blurInput(node.data, 'editingName')" placeholder="请输入节点名称" @contextmenu.stop draggable="false"
                                        style="height: 20px; width: 150px;" :ref="el => setInputRef(el, node.data)"></el-input>
                                    <div v-else style="width: auto;" @dblclick="handleClick(node.data, 'editingName')">
                                        <span>
                                            <el-icon v-if="node.data.children" color="orange"><Folder /></el-icon>
                                            <el-icon v-else color="dodgerblue"><Document /></el-icon>
                                            {{ node.data.name }}
                                        </span>
                                    </div>
                                </template>
                            </el-popover>

                            <div style="width: 59vw;">
                                <div style="display: flex; flex: auto; justify-content: space-between;">
                                    <div style="width: 150px; text-align: center;" @dblclick="handleClick(node.data, 'editingDatavalue')">
                                        <el-input v-if="node.data.editingDatavalue" v-model="node.data.datavalue"
                                            @blur="blurInput(node.data, 'editingDatavalue')" placeholder="请输入节点名称" @contextmenu.stop draggable="false"
                                            style="height: 20px; width: 70%;" :ref="el => setInputRef(el, node.data)"></el-input>
                                        <span v-else>{{ node.data.datavalue }}</span>
                                    </div>
                                    <div class="overflow-text" v-bind:title="node.data.remark" @dblclick="handleClick(node.data, 'editingRemark')">
                                        <el-input v-if="node.data.editingRemark" v-model="node.data.remark"
                                            @blur="blurInput(node.data, 'editingRemark')" placeholder="请输入节点名称" @contextmenu.stop draggable="false"
                                            style="height: 20px; width: 100%;" :ref="el => setInputRef(el, node.data)"></el-input>
                                        <span v-else>{{ node.data.remark }}</span>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import request from '../utils/request'


const defaultProps = {
  children: 'children',
  label: 'name',
}

const treeData = ref([
    {
        id: '1',
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

const openedPopNode = ref({});    // 记录哪个节点的弹出框被打开了

const nullNodeNum = ref(0);     // 未命名节点数

/*************预处理数据************/
const id = ref(1);

const initialize = (nodes) => {
    nodes.forEach((node) => {
        node.popVisible = false;
        node.editingName = false;
        node.editingDatavalue = false;
        node.editingRemark = false;
        node.id = id.value ++;
        
        if(node.name.includes('未命名能力')){
            if(node.name.length > 5){
                let num = '';
                for(let i = 6; node.name[i] !== ')'; i ++){
                    num += node.name[i];
                }
                if(nullNodeNum.value < Number(num)) nullNodeNum.value = Number(num);
            }
            else if(node.name.length === 5 && nullNodeNum.value === 0) nullNodeNum.value ++;
        }

        if (node.children && node.children.length > 0) {
			initialize(node.children); // 递归子节点
		}
    })
};

const getTreeData = () => {
    request.get('/coursemangt/abiblity').then((res) => {
        if(res.code === 200){
            treeData.value = res.data;
            nullNodeNum.value = 0;
            initialize(treeData.value);
        }
    }).catch((error) => {
        ElMessage({
            type: 'error',
            message: '获取能力数据失败'
        });
    })
};

onMounted(() => {
    initialize(treeData.value);
    // getTreeData();
    document.addEventListener('click', closePopNode);
});
/**********************************/

//展开所有或收起所有
const changeTreeExpand = () => {
    expandAll.value = !expandAll.value;
    for (let i = 0; i < nodeExpand.value.store._getAllNodes().length; i++) {
        nodeExpand.value.store._getAllNodes()[i].expanded = expandAll.value;
    }
}

/************ 与弹出框显示有关 **********/

const clickNode = (event, node, dom) => {   // 右键节点触发
	//event为必须参数鼠标点击对象，node为节点的数据是可选参数，dom是当前节点的DOM元素也是可选参数
	if (openedPopNode.value) {
		openedPopNode.value.popVisible = false; // 防止多个弹出框一块显示，不好看
		openedPopNode.value = {};
	}
	node.popVisible = true;
	openedPopNode.value = node;
}

const closePopNode = (event) => {
	// 检查点击事件是否在弹窗内部
	// 如果不是，则关闭弹窗
	if (openedPopNode.value && !event.target.closest('.el-popover')) {
		openedPopNode.value.popVisible = false;
		openedPopNode.value = {};
	}
};

onBeforeUnmount(() => {
    document.removeEventListener('click', closePopNode);
});
/***************************************/


/************对结点的操作************/
const handleClick = (node, field) => {
    nextTick(() => {
        node[field] = true;
        setTimeout(() => {
            if(inputRefs.value[node.id] && inputRefs.value[node.id].$refs.input){
                inputRefs.value[node.id].$refs.input.focus();
            }
        }, 0);
    })
};

const blurInput = (node, field) => {
	node[field] = false;
}

const addSiblingNode = (node) => {
    nullNodeNum.value ++;
    const newNode = {
        id: node.id,
        pid: node.pid,
        abilbitydeep: node.abilitydeep,
        type: '1',
        cmAbility: {
            name: nullNodeNum.value > 1 ? '未命名能力(' + nullNodeNum.value + ')' : '未命名能力',
            remark: ''
        }
    };
    console.log(newNode);
    // request.post('/coursemangt/ability/create', newNode.value).then((res) => {
    //     if(res.code === 400){
    //         getTreeData();
    //     }
    // }).catch((error) => {
    //     ElMessage.error('获取能力数据失败');
    // })

    node.popVisible = false;
};

const addChildNode = (node) => {
    nullNodeNum.value ++;
    const newNode = {
        id: node.id,
        pid: node.pid,
        abilbitydeep: node.abilitydeep,
        type: '0',
        cmAbility: {
            name: nullNodeNum.value > 1 ? '未命名能力(' + nullNodeNum.value + ')' : '未命名能力',
            remark: ''
        }
    }
    console.log(newNode);
    // request.post('/coursemangt/ability/create', newNode.value).then((res) => {
    //     if(res.code === 400){
    //         getTreeData();
    //     }
    // }).catch((error) => {
    //     ElMessage.error('获取能力数据失败');
    // })
    
    node.popVisible = false;
};

const confirmDeleteNodes = (node) => {
    ElMessageBox.confirm(
        `是否删除"${node.name}"能力及其下属所有能力?`,
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        let deletesNodes = findChildNodes(node.children, [node.id]);
        // console.log(deletesNodes);

        // request.post('/coursemangt/ability/delete', deletesNodes).then((res) => {
        //     if(res.code === 400){
        //         getTreeData();
        //     }
        // }).catch((error) => {
        //     ElMessage.error('删除失败');
        // });
    }).catch(() => {});
    node.popVisible = false;
};

const findChildNodes = (nodes, array = []) => {  // 查找某一节点的所有子节点id
    nodes.forEach((item) => {
        array.push(item.id);
        if(item.children && item.children.length > 0){
            array = findChildNodes(item.children, array);
        }
    })
    return array;
};
/***********************************/

/***************与输入框显示有关***************/

const inputRefs = ref({});

const setInputRef = (el, node) => {
  if (el) {
    inputRefs.value[`${node.id}`] = el;
  }
};

/********************************************/
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
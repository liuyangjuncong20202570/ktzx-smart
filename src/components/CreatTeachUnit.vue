    <template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;">导出到Excel</el-button>
            <el-button type="success" style="margin-left: 0.8vw;">保存</el-button>
        </el-header>

        <el-main style="padding: 0;">
            <div style="max-height: 100%; height: 100%; overflow:auto;">
                <el-tree :data="treeData" draggable :props="defaultProps" node-key="id" @node-drag-start="handleDragStart"
                    @node-drag-end="handleDragEnd" @node-contextmenu="clickNode">
                    <template #default="{ node }">
                        <el-popover :visible="node.data.popVisible" placement="right">
                            <el-button style="margin-top: 6px;" type="success" @click="editNode(node.data)">编辑</el-button><br>
                            <el-button style="margin-top: 6px;" type="primary" @click="addSiblingNode(node.data)">同级新增</el-button><br>
                            <el-button style="margin-top: 6px;" type="primary" @click="addChildNode(node.data)">下级新增</el-button><br>
                            <el-button style="margin-top: 6px;" type="danger" @click="confirmDeleteNodes(node.data)">删除</el-button>
                            <div style="text-align: right;">
                                <el-button style="margin-top: 6px;" :type="'info'" link 
                                @click="node.data.popVisible = false;">取消</el-button>
                            </div>
                            <template #reference>
                                <!-- 这里用一个临时量来存新节点，否则直接绑定node.data.label输入框会出问题 -->
                                <el-input v-if="node.data.inputVisible" v-model="node.data.tempData"
                                    @blur="blurInput(node.data)" placeholder="请输入节点名称" @contextmenu.stop draggable="false"
                                    style="height:25px; width: 200px;"></el-input>
                                <span>
                                    <el-icon v-if="node.data.children" color="orange"><Folder /></el-icon>
                                    <el-icon v-else color="dodgerblue"><Document /></el-icon>
                                    {{ node.data.label }}
                                </span>
                            </template>
                        </el-popover>
                    </template>
                </el-tree>
            </div>
        </el-main>
    </div>
</template>

<script lang="ts" setup>
import { Document, Folder } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { NodeDropType, } from 'element-plus/es/components/tree/src/tree.type'
import { ref, reactive, onMounted } from 'vue'

const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleDragStart = (draggingNode: Node, ev: DragEvents) => {   // 拖动某个节点的一瞬间触发
    findParent(draggingNode.data);  // 记录被拖拽节点在拖拽之前的父节点
}

const handleDragEnd = (     // 放置节点的时候触发
    draggingNode: Node,
    dropNode: Node,
    dropType: NodeDropType,
    ev: DragEvents
) => {
    // console.log('tree drag end:', dropNode && dropNode.label, dropType);
    if(dropType === 'none') return ;    // 没有改变节点位置
    if(parentData.value.parentNode && parentData.value.parentNode.children.length === 0){
        // 如果被拖拽节点拖拽之前的父节点在拖拽之后不存在子节点了，就删除子节点字段
        delete parentData.value.parentNode.children;
    }
    if(dropType === 'before'){      // 拖拽为同级节点并且在目标节点之前
        insertDraggingNode(draggingNode.data, dropNode.data, dropType);
        deleteOldDraggingNode(draggingNode.data);
    }
    else if(dropType === 'inner'){   // 拖拽为目标节点的内层节点
        if(!dropNode.data.children) dropNode.data.children = [];
        dropNode.data.children.push(draggingNode.data);
        deleteOldDraggingNode(draggingNode.data);
    }
    else if(dropType === 'after'){  // 拖拽为同级节点且在目标节点之后
        insertDraggingNode(draggingNode.data, dropNode.data, dropType);
        deleteOldDraggingNode(draggingNode.data);
    }
    parentData.value = {parentNode: null, childrenIndex: null};
    // console.log(treeData.value);
};

const parentData = ref({parentNode: null, childrenIndex: null});    // 记录被拖拽节点的父节点

const findParent = (childNode, nodes = treeData.value, parent = null) => {  // 递归查找父节点
    for(let i = 0; i < nodes.length; i ++){
        if(nodes[i].label === childNode.label){
            if(parent){
                parentData.value = {parentNode: parent, childrenIndex: i};
            }
            else parentData.value = {parentNode: null, childrenIndex: i};
            return true;
        }
        if(nodes[i].children && nodes[i].children.length > 0){
            if(findParent(childNode, nodes[i].children, nodes[i])) return true;
        }
    }
    return false;
};

const insertDraggingNode = (draggingNode, dropNode, dropType) => {  // 将节点插入的操作
    findParent(dropNode);   // 查找目标节点的父节点
    if(dropType === 'before') dropType = 0;     // 放在目标节点之前
    else if(dropType === 'after') dropType = 1; // 放在目标节点之后
    if(!parentData.value.parentNode){
        treeData.value.splice(parentData.value.childrenIndex + dropType, 0, draggingNode);
    }
    else{
        parentData.value.parentNode.children.splice(parentData.value.childrenIndex + dropType, 0, draggingNode);
    }
};

const deleteOldDraggingNode = (draggingNode) => {   // 删除被拖拽节点之前的信息
    findParent(draggingNode);
    if(!parentData.value.parentNode){
        treeData.value.splice(parentData.value.childrenIndex, 1);
    }
    else{
        parentData.value.parentNode.children.splice(parentData.value.childrenIndex, 1);
    }
};

// 递归初始化popVisible
const initialize = (nodes) => {
    nodes.forEach((node) => {
        node.popVisible = false;
        node.inputVisible = false;
        node.tempData = null;
        if (node.children && node.children.length > 0) {
            initialize(node.children); // 递归子节点
        }
    });
};

onMounted(() => {
    initialize(treeData.value);
})

const openedPopNode = ref({});    // 记录哪个节点的弹出框被打开了

const clickNode = (event, node, dom) => {   // 右键节点触发
    //event为必须参数鼠标点击对象，node为节点的数据是可选参数，dom是当前节点的DOM元素也是可选参数
    if(openedPopNode.value){
        openedPopNode.value.popVisible = false; // 防止多个弹出框一块显示，不好看
        openedPopNode.value = null;
    }
    node.popVisible = true;
    openedPopNode.value = node;
    // console.log(treeData.value);
}

const newNode = ref({   // 新的空节点
    id: '',
    label:'未命名节点',
    popVisible: false,
    inputVisible: true,
    tempData: null
});

const addSiblingNode = (addedNode, nodes = treeData.value, parent = null) => {
    for(let i = 0; i < nodes.length; i ++) {    // 遍历所有元素
        if(nodes[i].label === addedNode.label){
            if(parent){     // 如果找到了被选中节点，并且其存在父节点，就在父节点的children中添加新节点
                parent.children.push(newNode.value);
            }
            else {      // 否则则为最外层节点，直接添加
                treeData.value.push(newNode.value);
                // console.log(treeData.value);
            }
            addedNode.popVisible = false; // 添加完毕恢复
            newNode.value = {
                id: '',
                label: '未命名节点',
                popVisible: false,
                inputVisible: true,
                tempData: null
            };      // 这里重新赋值一遍没有更改过的newNode是为了再添加新节点时的el-tree组件自带的treeNodeId改变否则会浏览器报错爆栈
                    // 应该是会重新给newNode分配地址，然后组件在下次创建新节点时会根据地址不同分配不同的treeNodeId
            return true;
        }
        if(nodes[i].children && nodes[i].children.length > 0){  // 如果没找到选中节点且存在子节点则递归搜寻子节点
            if(addSiblingNode(addedNode, nodes[i].children, nodes[i])) return true;
        }
    }
}

const blurInput = (node) => {
    if(node.tempData !== null && node.tempData !== node.label && node.tempData !== ''){
        node.label = node.tempData;
        node.tempData = null;
    }
    node.inputVisible = false;
}

const editNode = (node) => {
    node.tempData = node.label;
    node.inputVisible = true;
    node.popVisible = false;
    // console.log(tempNode.value);
}

const addChildNode = (node) => {
    if(!node.children){
        node.children = [];
    }
    node.children.push(newNode.value);
    node.popVisible = false;
    newNode.value = {
        id: '',
        label: '未命名节点',
        popVisible: false,
        inputVisible: true,
        tempData: null    // 未命名节点只是新增节点后没有立刻命名所生成的临时名称
    };  // 这里重新赋值一遍没有更改过的newNode是为了再添加新节点时的el-tree组件自带的treeNodeId改变否则会浏览器报错爆栈
        // 应该是会重新给newNode分配地址，然后组件在下次创建新节点时会根据地址不同分配不同的treeNodeId
}

const confirmDeleteNodes = (deletedNode) => {
    ElMessageBox.confirm(
        '选中节点及其内部所有节点将被删除，是否确定',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {deleteNodes(deletedNode)})
    .catch(() => {deletedNode.popVisible = false});
}

const deleteNodes = (deletedNode, nodes = treeData.value, parent = null) => {
    for(let i = 0; i < nodes.length; i ++){     // 删除节点逻辑与增加同级节点相同
        if(nodes[i].label === deletedNode.label){
            if(parent){
                parent.children.splice(i, 1);
                if(parent.children.length === 0){   // 如果没有子节点了，就删除子节点字段（根据角色授权的树形结构中后端传输的数据设计）
                    delete parent.children;
                }
            }
            else{
                treeData.value.splice(i, 1);
            }
            return true;
        }
        if(nodes[i].children && nodes[i].children.length > 0){
            if(deleteNodes(deletedNode, nodes[i].children, nodes[i])) return true;
        }
    }
};

const treeData: any = ref([
    {
        id: '1',
        label: '电气与控制工程学院',
        children: [
            {
                id: "1-1",
                label: '自动化系',
                children: [
                    {
                        id: '1-1-1',
                        label: '自动化18级',
                        children:[
                            {
                                id: '1-1-1-1',
                                label: '自18-1',
                            },
                            {
                                id: '1-1-1-2',
                                label: '自18-2',
                            }
                        ]
                    },
                    {
                        id: '1-1-2',
                        label: '自动化19级',
                        children: [
                            {
                                id: '1-1-2-1',
                                label: '自19-1',
                            },
                            {
                                id: '1-1-2-2',
                                label: '自19-2',
                            },
                            {
                                id: '1-1-2-3',
                                label: '自19-3',
                            }
                        ]
                    },
                    {
                        id: '1-1-3',
                        label: '自动化20级',
                        children: [
                            {
                                id: '1-1-3-1',
                                label: '自20-1',
                            },
                            {
                                id: '1-1-3-2',
                                label: '自20-2',
                            },
                            {
                                id: '1-1-3-3',
                                label: '自20-3',
                            }
                        ]
                    }
                ],
            },
        ],
    },
    {
        id: '2',
        label: '信息学院',
        children: [
            {
                id: "2-1",
                label: '计算机系',
                children: [
                    {
                        id: '2-1-1',
                        label: '计算机18级',
                        children:[
                            {
                                id: '2-1-1-1',
                                label: '计18-1',
                            },
                            {
                                id: '1-1-1-2',
                                label: '计18-2',
                            }
                        ]
                    },
                    {
                        id: '2-1-2',
                        label: '计算机19级',
                        children: [
                            {
                                id: '2-1-2-1',
                                label: '计19-1',
                            },
                            {
                                id: '2-1-2-2',
                                label: '计19-2',
                            },
                            {
                                id: '2-1-2-3',
                                label: '计19-3',
                            }
                        ]
                    },
                    {
                        id: '2-1-3',
                        label: '计算机20级',
                        children: [
                            {
                                id: '2-1-3-1',
                                label: '计20-1',
                            },
                            {
                                id: '2-1-3-2',
                                label: '计20-2',
                            },
                            {
                                id: '2-1-3-3',
                                label: '计20-3',
                            }
                        ]
                    }
                ],
            },
            {
                id: "2-2",
                label: '人工智能系',
                children: [
                    {
                        id: '2-2-1',
                        label: '人工智能18级',
                        children:[
                            {
                                id: '2-2-1-1',
                                label: '人工智能18-1',
                            },
                            {
                                id: '2-2-1-2',
                                label: '人工智能18-2',
                            }
                        ]
                    },
                    {
                        id: '2-2-2',
                        label: '人工智能19级',
                        children: [
                            {
                                id: '2-2-2-1',
                                label: '人工智能19-1',
                            },
                            {
                                id: '2-2-2-2',
                                label: '人工智能19-2',
                            },
                            {
                                id: '2-2-2-3',
                                label: '人工智能19-3',
                            }
                        ]
                    },
                    {
                        id: '2-2-3',
                        label: '人工智能20级',
                        children: [
                            {
                                id: '2-2-3-1',
                                label: '人工智能20-1',
                            },
                            {
                                id: '2-2-3-2',
                                label: '人工智能20-2',
                            },
                            {
                                id: '2-2-3-3',
                                label: '人工智能20-3',
                            }
                        ]
                    }
                ],
            },
        ],
    },
]);
</script>
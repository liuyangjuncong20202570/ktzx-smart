    <template>
    <div style="height: 92vh; display: flex; flex-direction: column;">
        <el-header
            style="height: auto; padding: 5px 0px; width:100%; background-color:#deebf7; display: flex; align-items: center;">
            <el-button type="primary" style="margin-left: 0.8vw;">导出到Excel</el-button>
            <el-button type="success" style="margin-left: 0.8vw;">保存</el-button>
        </el-header>

        <el-main style="padding: 0;">
            <div style="max-height: 100%; height: 100%; overflow:auto;">
                <el-tree :allow-drop="allowDrop" :allow-drag="allowDrag" :data="treeData" draggable 
                    :props="defaultProps" node-key="id" @node-drag-start="handleDragStart"
                    @node-drag-enter="handleDragEnter" @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver"
                    @node-drag-end="handleDragEnd" @node-drop="handleDrop" @node-contextmenu="clickNode">
                    <template #default="{ node }">
                        <el-popover :visible="popVisible[node.data.label]" placement="right">
                            <el-button style="margin-top: 6px;" type="success" @click="editNode(node)">编辑</el-button><br>
                            <el-button style="margin-top: 6px;" type="primary" @click="addSiblingNode(node.data)">同级新增</el-button><br>
                            <el-button style="margin-top: 6px;" type="primary" @click="addChildNode(node)">下级新增</el-button><br>
                            <el-button style="margin-top: 6px;" type="danger" @click="confirmDeleteNodes(node.data)">删除</el-button>
                            <div style="text-align: right;">
                                <el-button style="margin-top: 6px;" :type="'info'" link 
                                @click="popVisible[node.data.label] = false;">取消</el-button>
                            </div>
                            <template #reference>
                                <!-- 这里用一个临时量来存新节点，否则直接绑定node.data.label输入框会出问题 -->
                                <el-input v-if="inputVisible[node.data.label]" v-model="tempNode[node.data.label]"
                                    @blur="blurInput(node)" placeholder="请输入节点名称" @contextmenu.stop draggable="false"
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
import type { AllowDropType,NodeDropType, } from 'element-plus/es/components/tree/src/tree.type'
import { ref, reactive, onMounted } from 'vue'

const defaultProps = {
  children: 'children',
  label: 'label',
}

const handleDragStart = (node: Node, ev: DragEvents) => {
    console.log('drag start', node)
}
const handleDragEnter = (
    draggingNode: Node,
    dropNode: Node,
    ev: DragEvents
) => {
    console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (
    draggingNode: Node,
    dropNode: Node,
    ev: DragEvents
) => {
    console.log('tree drag leave:', dropNode.label)
}
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvents) => {
    console.log('tree drag over:', dropNode.label)
}
const handleDragEnd = (
    draggingNode: Node,
    dropNode: Node,
    dropType: NodeDropType,
    ev: DragEvents
) => {
    console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
const handleDrop = (
    draggingNode: Node,
    dropNode: Node,
    dropType: NodeDropType,
    ev: DragEvents
) => {
    console.log('tree drop:', dropNode.label, dropType)
}
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
    if (dropNode.data.label === 'Level two 3-1') {
        return type !== 'inner'
    } else {
        return true
    }
}
const allowDrag = (draggingNode: Node) => {
    return !draggingNode.data.label.includes('Level three 3-1-1')
}

// 这里popVisible和inputVisible分别控制树节点的右键弹出框和输入框是否显示，其是根据节点的label来存储布尔值的
const popVisible = ref({}); 
const inputVisible = ref({});

// 递归初始化popVisible
const initialize = (nodes) => {
    nodes.forEach((node) => {
        popVisible.value[node.label] = false;
        inputVisible.value[node.label] = false;
        if (node.children && node.children.length > 0) {
            initialize(node.children); // 递归子节点
        }
    });
};

onMounted(() => {
    initialize(treeData.value);
})

const clickNode = (event, node, dom) => {
    //event为必须参数鼠标点击对象，node为节点的数据是可选参数，dom是当前节点的DOM元素也是可选参数
    Object.keys(popVisible.value).forEach(key => {
        popVisible.value[key] = false;
    })
    popVisible.value[node.label] = true;
    selectedNode.value = node;
    // console.log(treeData.value);
}

const newNode = ref({   // 新的空节点
    id: '',
    label:'未命名节点',
});

const selectedNode = ref(null);     // 被选中的节点

const hasEmptyNode = ref(false);    // 是否存在空的节点

const addSiblingNode = (addedNode, nodes = treeData.value, parent = null) => {
    if(hasEmptyNode.value){
        ElMessage.error('请先处理未命名节点！');
        popVisible.value[addedNode.label] = false;
        return false;
    }
    for(let i = 0; i < nodes.length; i ++) {    // 遍历所有元素
        if(nodes[i].label === addedNode.label){
            hasEmptyNode.value = true;
            if(parent){     // 如果找到了被选中节点，并且其存在父节点，就在父节点的children中添加新节点
                parent.children.push(newNode.value);
            }
            else {      // 否则则为最外层节点，直接添加
                treeData.value.push(newNode.value);
                // console.log(treeData.value);
            }
            inputVisible.value[newNode.value.label] = true;
            popVisible.value[newNode.value.label] = false;
            popVisible.value[selectedNode.value.label] = false; // 添加完毕恢复
            newNode.value = {
                id: '',
                label: '未命名节点',
            };      // 这里重新赋值一遍没有更改过的newNode是为了再添加新节点时的el-tree组件自带的treeNodeId改变否则会浏览器报错爆栈
                    // 应该是会重新给newNode分配地址，然后组件在下次创建新节点时会根据地址不同分配不同的treeNodeId
            return true;
        }
        if(nodes[i].children && nodes[i].children.length > 0){  // 如果没找到选中节点且存在子节点则递归搜寻子节点
            if(addSiblingNode(addedNode, nodes[i].children, nodes[i])) return true;
        }
    }
}

const tempNode = ref({});   // 这里用一个临时节点来存被编辑节点，否则输入框直接绑定node.data.label会出问题

const blurInput = (node) => {
    if(tempNode.value[node.data.label] !== undefined && tempNode.value[node.data.label] !== node.data.label){
        let oldName = node.data.label;      // 原节点名字
        let newName = tempNode.value[node.data.label];  // 新的名字
        popVisible.value[newName] = popVisible.value[oldName];      // 重命名对应新名字的字段
        delete popVisible.value[oldName];
        inputVisible.value[newName] = inputVisible.value[oldName];
        delete inputVisible.value[oldName];
        tempNode.value[newName] = tempNode.value[oldName];
        delete tempNode.value[oldName];
        node.data.label = newName;
        hasEmptyNode.value = false;     // 若输入的数据与原数据不同则此节点不为未命名节点
    }
    inputVisible.value[node.data.label] = false;
    // console.log(popVisible.value);
    // console.log(treeData.value);
    // console.log(inputVisible.value);
    // console.log(tempNode.value);
}

const editNode = (node) => {
    tempNode.value[node.data.label] = node.data.label;
    inputVisible.value[node.label] = true;
    popVisible.value[node.label] = false;
    // console.log(tempNode.value);
}

const addChildNode = (node) => {
    if(hasEmptyNode.value){
        ElMessage.error('请先处理未命名节点！');
        return ;
    }
    if(!node.data.children){
        node.data.children = [];
    }
    node.data.children.push(newNode.value);
    popVisible.value[newNode.value.label] = popVisible.value[node.data.label] = false;
    inputVisible.value[newNode.value.label] = true;
    hasEmptyNode.value = true;
    newNode.value = {
        id: '',
        label: '未命名节点',    // 未命名节点只是新增节点后没有立刻命名所生成的临时名称
    };  // 这里重新赋值一遍没有更改过的newNode是为了再添加新节点时的el-tree组件自带的treeNodeId改变否则会浏览器报错爆栈
        // 应该是会重新给newNode分配地址，然后组件在下次创建新节点时会根据地址不同分配不同的treeNodeId

    // console.log(popVisible.value);
    // console.log(treeData.value);
    // console.log(inputVisible.value);
    // console.log(tempNode.value);
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
    .catch(() => {popVisible.value[deletedNode.label] = false});
}

const deleteNodes = (deletedNode, nodes = treeData.value, parent = null) => {
    if(parent === null){
        
    }
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
            delete popVisible.value[deletedNode.label];
            delete inputVisible.value[deletedNode.label];
            delete tempNode.value[deletedNode.label];
            if(deletedNode.children) deleteChildNode(deletedNode);  // 存在子节点则删除所有子节点的对应数据
            // console.log(popVisible.value);
            // console.log(treeData.value);
            // console.log(inputVisible.value);
            return true;
        }
        if(nodes[i].children && nodes[i].children.length > 0){
            if(deleteNodes(deletedNode, nodes[i].children, nodes[i])) return true;
        }
    }
};

const deleteChildNode = (deletedNode) => {      // 递归删除子节点的对应弹框、输入框和输入框数据的数据
    deletedNode.children.forEach((node) => {
        delete popVisible.value[node.label];
        delete inputVisible.value[node.label];
        delete tempNode.value[node.label];
        if(node.children){
            deleteChildNode(node);
        }
    })
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
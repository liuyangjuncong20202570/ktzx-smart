<template>
    <div style="height: 92vh; overflow: hidden;">
        <div :style="[staticStyles, { backgroundColor: bkgColor }]">
            <div style="height: 100%; width: 40%; display: flex; flex-direction: row; justify-content: space-between;">
                <div class="page-btn left" id="2d" @click="changePage(0, $event)">
                    2D</div>
                <div class="page-btn right" id="3d" @click="changePage(1, $event)">3D</div>
            </div>
        </div>

        <KWAgraph style="height: 93%;" v-if="showPage === 0"></KWAgraph>
        <threeDgraph style="height: 93;" v-if="showPage === 1"></threeDgraph>
    </div>
</template>


<script setup>
import KWAgraph from "./subcomponents/KWAgraph.vue";
import threeDgraph from './subcomponents/3Dgraph.vue';
import { ref } from "vue";

const showPage = ref(0);     // 0是2D页面，1是3D页面

const staticStyles = {
    height: '7%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const bkgColor = ref('white')

const changePage = (code, event) => {
    showPage.value = code;
    bkgColor.value = code === 0 ? 'white' : 'black';
    // 切换2d和3d按钮的样式
    const id = event.target.id;
    let buttons = document.getElementsByClassName('page-btn');
    for(let button of buttons) {
        button.style.borderBottom = 'none';
    }
    document.getElementById(id).style.borderBottom = '3px solid #626aef';
}

</script>

<style scoped>
.page-btn {
    height: 90%;
    width: 25%;
    line-height: 7vh;
    color: #626aef;
    cursor: pointer;
    font-size: 20px;
}

.page-btn.left {
    border-bottom: 3px solid #626aef;
}

.page-btn.left:hover {
    box-shadow: 0px -5px 5px -5px #626aef inset;
}

.page-btn.right:hover {
    box-shadow: 0px -5px 5px -5px #626aef inset;
}
</style>
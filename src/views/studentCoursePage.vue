<template>
  <div style="height: 100vh;">
    <el-container class="layout-container-demo" style="height: 100%;">
      <el-header style="position: relative; text-align:right; background-color: #0064B1; font-size: 15px; height: 8vh">

        <!--右侧按钮-->
        <div style="height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 0">
          <div class="left-div" style="flex-grow: 1; display: flex; align-items: center;  ">
            <el-text style="font-size: calc(1vw + 10px); color: white; margin-left: 10px;">{{ courseChineseName }}
            </el-text>
          </div>

          <div class="right-div" style="flex-grow: 1; display: flex; align-items: center; justify-content: flex-end;">
            <el-dropdown>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-text style="font-size: calc(1vw + 3px); color: white; margin-left: 10px;">{{ loginInfo.username }}
            </el-text>
          </div>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px" style="height: 100%;">

          <!-- 使用 el-scrollbar 包裹 el-menu，设置高度为 70% -->

          <!--页面左侧导航栏-->

          <div style="height: calc(92vh - 150px);">
            <el-scrollbar>
              <el-menu :default-active="defaultActive">
                <template v-for="menu in filteredMenus">
                  <el-sub-menu v-if="hasChildren(menu)" :index="menu.id" :key="menu.id"
                               style="border-top: 1px solid #efefef;">
                    <template #title>
                      <span>{{ menu.name }}</span>
                    </template>
                    <el-menu-item v-for="child in getChildrenMenus(menu)" :index="child.url" :key="child.id"
                                  style="border-top: 1px solid #efefef;" @click="navigateTo(child.url)">
                      <span>{{ child.name }}</span>
                    </el-menu-item>
                  </el-sub-menu>
                  <el-menu-item v-else :index="menu.url" :key="menu.id" @click="navigateTo(menu.url)"
                                style="border-top: 1px solid #efefef;">
                    <span>{{ menu.name }}</span>
                  </el-menu-item>
                </template>
              </el-menu>
            </el-scrollbar>
          </div>
        </el-aside>

        <el-main>

          <!-- 在 el-main 区域显示路由组件 -->

          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, onMounted, toRaw} from 'vue'
import {useRoute, useRouter} from 'vue-router';
import request from "../utils/request.js";

import {ElMessage,} from 'element-plus'
import {Menu as IconMenu, Message, Setting, Plus, Platform, Right} from '@element-plus/icons-vue'
import type {UploadProps} from 'element-plus'
import {useProfileStore} from "../stores/profileStore.js";


//获取Stroe
const profileStore = useProfileStore();

const defaultActive = ref('');
const router = useRouter(); // 获取路由实例
const route = useRoute();
const courseChineseName = ref('');


// 清除登录信息的方法
function clearLoginInfo() {
  // 清除其他可能存储的信息
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('isLoggedIn');
}


//登出的方法

const handleLogout = () => {
  clearLoginInfo();
  router.push({name: 'Login'});
};


// 默认显示菜单
// const defaultActive = ref('');

const menus = ref([]);

const loginInfo = reactive({
  username: profileStore.profilename,
  rolename: profileStore.profilerolename,
  catelog: profileStore.profilecatelog,
  currentterm: profileStore.currentterm
});


//0310将homeurl修改为响应式计算属性，这样下面的profileStore中的值变了这边也会自动变，解决拼接地址存在问题情况

const homeurl = computed(() => profileStore.profilehomeurl);
const excludedPids = ['0', '102'];

//过滤器
const filteredMenus = computed(() => {
  return menus.value
      .filter(menu => !excludedPids.includes(menu.pid))
      //0311加入菜单按顺序排列
      .sort((a, b) => a.orderno - b.orderno);
});

//过滤节点是否有孩子节点
const hasChildren = (menu) => {
  // console.log(menu);
  if (menu.children && menu.children.length > 0) return true;
  return false;
};
//获取节点的孩子节点
const getChildrenMenus = (menu) => {
  return menu.children;
};
//路由导航
const navigateTo = (url) => {
  //前面拼一个/表示绝对路径
  console.log(homeurl.value + url)
  router.push(homeurl.value + url);
};

const getmenu = () => {
  request.admin.post(`/homes/studentmenu`)
      .then(res => {

        console.log(res)
        // 登录成功

        if (res.code === 200) {
          menus.value = res.data;
        }
      }).catch(error => {

    // 获取失败

    ElMessage({
      type: 'error',
      message: '获取导航失败'
    });
  });
}


//钩子函数用来刷新后重新获取数据

onMounted(() => {
  courseChineseName.value = <string>route.query.courseChineseName || '未提供课程名称';
  getmenu()
});

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  color: var(--el-text-color-primary);
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 0;
}

.layout-container-demo .toolbar {
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>

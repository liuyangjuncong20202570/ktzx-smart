<template>
  <div style="height: 100vh;">
    <el-container class="layout-container-demo" style="height: 100%;">
      <el-header style="position: relative; text-align:right; background-color: #0064B1; font-size: 15px; height: 8vh">
        <div style="height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 0">
          <div class="left-div" style="flex-grow: 1; display: flex; align-items: center;">
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
import {ElMessage} from 'element-plus'
import {useProfileStore} from "../stores/profileStore.js";

const profileStore = useProfileStore();

const defaultActive = ref('');
const router = useRouter();
const route = useRoute();
const courseChineseName = ref('');

function clearLoginInfo() {
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('isLoggedIn');
}

const handleLogout = () => {
  clearLoginInfo();
  router.push({name: 'Login'});
};

const menus = ref([]);

const loginInfo = reactive({
  username: profileStore.profilename,
  rolename: profileStore.profilerolename,
  catelog: profileStore.profilecatelog,
  currentterm: profileStore.currentterm
});

const homeurl = computed(() => profileStore.profilehomeurl);
const excludedPids = ['0', '102'];

const filteredMenus = computed(() => {
  return menus.value
      .filter(menu => !excludedPids.includes(menu.pid))
      .sort((a, b) => a.orderno - b.ordeno);
});

const hasChildren = (menu) => {
  if (menu.children && menu.children.length > 0) return true;
  return false;
};

const getChildrenMenus = (menu) => {
  return menu.children;
};

const navigateTo = (url) => {
  console.log(homeurl.value + url)
};

const getmenu = () => {
  request.admin.post(`/homes/studentmenu`)
      .then(res => {
        if (res.code === 200) {
          menus.value = res.data;
        }
      }).catch(error => {
    ElMessage({
      type: 'error',
      message: '获取导航失败'
    });
  });
}

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

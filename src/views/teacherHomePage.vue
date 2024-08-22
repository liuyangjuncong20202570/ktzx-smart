<template>
  <div style="height: 100vh;">
    <el-container class="layout-container-demo" style="height: 100%;">
      <el-header style="position: relative; text-align:right; background-color: #0064B1; font-size: 15px; height: 8vh">
        <!--右侧按钮-->
        <div style="height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 0">
          <div class="left-div" style="flex-grow: 1; display: flex; align-items: center;  ">
            <img src="../assets/images/logo.png" style="height: 5.5vh;" />
            <el-text style="font-size: calc(1vw + 6px); color: white; margin-left: 10px;">自动化专业智能教学平台</el-text>
          </div>

          <div style="flex-grow: 2; text-align: center;">
            <el-text style="font-size: calc(1.5vw + 6px); color: white;">2024春季学期</el-text>
          </div>

          <div class="right-div" style="flex-grow: 1; display: flex; align-items: center; justify-content: flex-end;">
            <el-dropdown>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>查看详情</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-text style="font-size: calc(1vw + 3px); color: white; margin-left: 10px;">{{ loginInfo.username
              }}</el-text>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" style="height: 100%;">
          <div style="width: 100%; height: 150px; padding: 10px 0; background-color: #c8c9cc; display: flex; align-items: center;
                    box-sizing: border-box;">
            <!--头像-->
            <div style="width: 76px; height: 105px; margin-left: 10px; overflow: hidden;object-fit: cover;">
              <el-upload style="width: 100%; height: 100%; display: flex;" class="avatar-uploader"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar"
                  style="width: 100%; height: 120%; object-fit: cover;" />
                <el-text v-else size="small" style="width:72px; color:white">点击上传头像</el-text>
              </el-upload>
            </div>
            <div style="width: 88px; margin: 0 15px 0 15px">
              <el-row :gutter="0">
                <p style="font-size: 14px; line-height: 15px;">{{ loginInfo.username }}</p>
              </el-row>
              <el-row :gutter="0">
                <p style="font-size: 14px; margin-left: 2px; color: cornflowerblue; line-height: 0.2;">{{
                  loginInfo.rolename
                  }}
                </p>
              </el-row>
              <el-row :gutter="0" style="height: 20px; margin-top: 20px">
                <el-col :span="5">
                  <el-icon style="float: left; margin-top: 2px; margin-left: 1px; color: blue">
                    <Platform />
                  </el-icon>
                </el-col>
                <el-col :span="7" style="">
                  <p style="font-size: 10px; line-height: 0">在线</p>
                </el-col>
                <el-col :span="5">
                  <el-icon style="float: left; margin-top: 2px; margin-left: 3px">
                    <Right />
                  </el-icon>
                </el-col>
                <el-col :span="7" style="">
                  <p style="font-size: 10px; line-height: 0">注销</p>
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="height: calc(92vh - 150px);">
            <el-scrollbar style="border-right: 1px solid #dedede;">
              <el-menu :default-active="defaultActive">
                <template v-for="menu in filteredMenus">
                  <el-sub-menu v-if="hasChildren(menu)" :index="menu.id" :key="menu.id"
                    style="border-top: 1px solid #efefef;">
                    <template #title>
                      <span @click="navigateTo(menu.url)">{{ menu.name }}</span>
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
import { ref, reactive, computed, onMounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import request from "../utils/request.js";
import { ElMessage, } from 'element-plus'
import { Menu as IconMenu, Message, Setting, Plus, Platform, Right } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { useProfileStore } from "../stores/profileStore.js";

const profileStore = useProfileStore();

const defaultActive = ref('');
const route = useRoute();
const router = useRouter(); // 获取路由实例

const imageUrl = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG or PNG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 5MB!')
    return false
  }
  return true
}

function clearLoginInfo() {
  // 清除其他可能存储的信息
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('isLoggedIn');
}

const handleLogout = () => {
  clearLoginInfo();
  router.push({name: 'Login'});
};

const menus = ref([
]);

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
    .sort((a, b) => a.orderno - b.orderno);
});

const hasChildren = (menu) => {
  if (menu.children && menu.children.length > 0) return true;
  return false;
};
const getChildrenMenus = (menu) => {
  return menu.children;
};
const navigateTo = (url) => {
  if (!url) return
  router.push(homeurl.value + url);

};

onMounted(() => {
  const defaultActive = ref('');
  const storedUserInfo = sessionStorage.getItem('users');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    profileStore.setProfileInfo(userInfo.username, userInfo.rolename, userInfo.catelog, userInfo.homeurl, userInfo.token, userInfo.currentterm);
    loginInfo.username = profileStore.profilename;
    loginInfo.rolename = profileStore.profilerolename;
    loginInfo.catelog = profileStore.profilecatelog;
  } else {
    sessionStorage.removeItem('users');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');

    router.push({ name: 'Login' });
  }
  router.push(homeurl.value);

  request.admin.post(`/homes/teacherhome`)
    .then(res => {
      console.log(res)
      if (res.code === 200 && res.data.length > 0) {
        menus.value = res.data;
      }
    }).catch(error => {
      // 获取失败
      ElMessage({
        type: 'error',
        message: '获取导航失败'
      });
    });
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

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader img,
.avatar-uploader .avatar-uploader-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 确保图片覆盖整个区域 */
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>

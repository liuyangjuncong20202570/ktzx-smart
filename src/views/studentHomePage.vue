<template>
  <div style="height: 100vh; background-color: #f0f0f0;">
    <el-container class="layout-container-demo" style="height: 100%;">
      <el-header style="position: relative; text-align:right; background-color: #0064B1; font-size: 15px; height: 8vh">
        <!--右侧按钮-->
        <div style="height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 0">
          <div class="left-div" style="flex-grow: 1; display: flex; align-items: center;">
            <img src="../assets/images/logo.png" style="height: 5.5vh;"/>
            <el-text style="font-size: calc(1vw + 6px); color: white; margin-left: 10px;">
              自动化专业智能教学平台
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
            <el-text style="font-size: calc(1vw + 3px); color: white; margin-left: 10px;">{{
                loginInfo.username
              }}
            </el-text>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="25%" style="padding: 20px;">
          <!--左侧我的课程部分-->
          <div class="my-courses-container" style="margin-left:20px;margin-top:10px">
            <div class="header">
              <el-text style="color: white;font-size: large">我的课程</el-text>
            </div>
            <div class="content">
              <el-scrollbar style="max-height: calc(92vh - 200px);">
                <el-menu :default-active="defaultActive" class="courses-menu">
                  <template v-for="menu in menus" :key="menu.id">
                    <el-menu-item :index="menu.url" @click="navigateTo(menu.id)">
                      <img src="../assets/images/studentpage/course.png" class="course-icon"/>
                      <span class="course-text">{{ menu.classroomName }}</span>
                    </el-menu-item>
                  </template>
                </el-menu>
              </el-scrollbar>
            </div>
          </div>
        </el-aside>

        <el-main style="padding: 20px;">
          <!--右侧内容部分-->
          <div class="right-content-container" style="margin-right:20px;margin-top:10px">
            <div class="header">
              <el-text style="color: white;font-size: large">课程详情</el-text>
            </div>
            <div class="content">
              <!-- 在 el-main 区域显示路由组件 -->
              <router-view></router-view>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import request from '../utils/request.js';
import {ElMessage} from 'element-plus';
import {useProfileStore} from '../stores/profileStore.js';

// 获取Store
const profileStore = useProfileStore();
const defaultActive = ref('');
const router = useRouter(); // 获取路由实例

const imageUrl = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');

// 清除登录信息的方法
function clearLoginInfo() {
  // 清除其他可能存储的信息
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('isLoggedIn');
}

// 登出的方法
const handleLogout = () => {
  clearLoginInfo();
  router.push({name: 'Login'}); // 假设您的登录路由的名字是 'Login'
};

const menus = ref([]);

const loginInfo = reactive({
  username: profileStore.profilename,
  rolename: profileStore.profilerolename,
  catelog: profileStore.profilecatelog,
  currentterm: profileStore.currentterm,
});

// 计算属性来处理动态 homeurl
const homeurl = computed(() => profileStore.profilehomeurl);

const courseinfo = ref({})
// 路由导航
const navigateTo = (id) => {
  console.log(id)
  request.admin.get('/homes/switchstucourse?id=' + id)
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          courseinfo.value = res.data;
          profileStore.setToken(courseinfo.value.token)
          sessionStorage.setItem('token', courseinfo.value.token);
          // router.push(courseinfo.value.courseChineseName);
          router.push({
            path: '/homes/studentcourses',
            query: {
              courseChineseName: courseinfo.value.courseChineseName
            }
          });
        }
      }).catch(error => {
    // 获取失败
    ElMessage({
      type: 'error',
      message: '获取导航失败',
    });
  });
};

// 钩子函数用来刷新后重新获取数据
onMounted(() => {
  const storedUserInfo = sessionStorage.getItem('users');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    // 更新用户信息到 Pinia
    profileStore.setProfileInfo(userInfo.username, userInfo.rolename, userInfo.catelog, userInfo.homeurl, userInfo.token, userInfo.currentterm);
    loginInfo.username = profileStore.profilename;
    loginInfo.rolename = profileStore.profilerolename;
    loginInfo.catelog = profileStore.profilecatelog;
  } else {
    // 如果没有存储的用户信息，可以重定向到登录页面或显示提示信息
    sessionStorage.removeItem('users');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    router.push({name: 'Login'});
  }
  // 获取完 Pinia 中的数据后重新重定向到父页面
  router.push(homeurl.value);

  // 获取菜单栏的数据
  request.admin.post('/homes/studenthome')
      .then(res => {
        // 登录成功
        if (res.code === 200) {
          menus.value = res.data;
        }
      }).catch(error => {
    // 获取失败
    ElMessage({
      type: 'error',
      message: '获取导航失败',
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

.my-courses-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 85vh;
}

.right-content-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 85vh;
}

.header {
  background-color: #0064B1;
  color: white;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.content {
  padding: 20px;
}

/* 添加课程列表样式 */
.courses-menu .el-menu-item {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #efefef;
}

.course-icon {
  height: 20px;
  margin-right: 10px;
}

.course-text {
  font-size: 17px; /* 调整字体大小 */
  transition: color 0.3s;
}

.courses-menu .el-menu-item:hover .course-text {
  color: #0064B1;
  cursor: pointer;
}
</style>

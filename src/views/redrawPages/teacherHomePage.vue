<template>
  <!-- <div style="width: 100vw; background-color: #eef7ff"> -->
  <div :style="{ width: '100vw', backgroundColor: 'var(--bg-color)' }">
    <el-container class="layout-container-demo">
      <History :isOpen="isOpen" @close="handleClose" />
      <el-header
        style="
          background-color: var(--bg-title-bar);
          position: relative;
          text-align: right;
          font-size: 15px;
          height: 100px;
          width: 100vw;
          box-shadow: 0px 0px 15px 0px rgba(0, 30, 56, 0.07);
          z-index: 999;
        "
      >
        <template #default>
          <div class="header">
            <div
              class="inner flex justify-between"
              style="width: 1250px; height: 100%; margin: 0 auto"
            >
              <div class="icon flex justify-center items-center">
                <img
                  style="width: 29px; height: 47px; padding-right: 5px"
                  referrerpolicy="no-referrer"
                  src="@/assets/images/redraw-images/icon.png"
                />
                <div class="flex items-center justify-center gap-4">
                  <img
                    style="width: 184px; height: 28px"
                    referrerpolicy="no-referrer"
                    src="@/assets/images/redraw-images/title.png"
                  />
                  <span class="text-gray-100" v-if="historyStore.nowUsr">当前为历史学期</span>
                </div>
                <span
                  class="term"
                  style="
                    font-size: 24px;
                    width: 116px;
                    height: 31px;
                    color: rgba(0, 120, 205, 1);
                    white-space: nowrap;
                    line-height: 31px;
                    font-family: MicrosoftYaHei;
                    margin-left: 33px;
                  "
                  >{{ currentterm }}</span
                >
              </div>
              <div class="right flex justify-center items-center" style="height: 100%">
                <img referrerpolicy="no-referrer" src="@/assets/images/redraw-images/divider.png" />
                <div class="mainner flex justify-between items-center">
                  <div
                    class="avatar flex justify-center items-center"
                    style="width: 60px; height: 60px; margin-left: 15px; margin-right: 5px"
                  >
                    <el-avatar
                      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                    />
                  </div>
                  <div class="text">
                    <div class="group_4">
                      <div class="top" style="margin-bottom: 5px">
                        <span
                          style="
                            width: 144px;
                            height: 24px;
                            overflow-wrap: break-word;
                            color: rgba(27, 27, 27, 1);
                            font-size: 18px;
                            font-family: MicrosoftYaHei;
                            font-weight: normal;
                            text-align: left;
                            white-space: nowrap;
                            line-height: 24px;
                          "
                          >{{ loginInfo.username }}</span
                        >
                      </div>
                      <div class="bottom flex justify-between items-center">
                        <div
                          style="
                            width: 62px;
                            height: 19px;
                            overflow-wrap: break-word;
                            color: rgba(0, 120, 205, 1);
                            font-size: 14px;
                            letter-spacing: 1.5px;
                            font-family: MicrosoftYaHei;
                            font-weight: normal;
                            text-align: right;
                            white-space: nowrap;
                            line-height: 19px;
                            text-overflow: ellipsis !important;
                            overflow: hidden;
                          "
                        >
                          <el-tag type="primary">{{ loginInfo.rolename }}</el-tag>
                        </div>
                        <div
                          style="
                            width: 31px;
                            height: 19px;
                            overflow-wrap: break-word;
                            color: rgba(1, 154, 72, 1);
                            font-size: 14px;
                            letter-spacing: 1.5px;
                            font-family: MicrosoftYaHei;
                            font-weight: normal;
                            text-align: right;
                            white-space: nowrap;
                            line-height: 19px;
                          "
                        >
                          <el-tag type="success">在线</el-tag>
                        </div>
                      </div>

                      <div class="block_12"></div>
                    </div>
                  </div>
                  <!-- 下拉按钮 -->
                  <el-dropdown @visible-change="handleVisibleChange">
                    <img
                      style="margin-left: 37px; width: 26px; height: 26px"
                      referrerpolicy="no-referrer"
                      src="@/assets/images/redraw-images/dropdown.png"
                    />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <template v-if="!showRoles">
                          <el-dropdown-item @click="openChangePwdDialog">修改密码</el-dropdown-item>
                          <el-dropdown-item v-if="!historyStore.nowUsr" @click="getRolelist"
                            >切换角色</el-dropdown-item
                          >
                          <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                          <el-dropdown-item v-if="!historyStore.nowUsr" @click="handleHistory"
                            >查看历史学期</el-dropdown-item
                          >
                          <el-dropdown-item v-else @click="backToNow"
                            >返回当前学期</el-dropdown-item
                          >
                        </template>
                        <template v-else>
                          <el-dropdown-item
                            v-for="role in roleList"
                            :key="role.roleid"
                            @click="switchRole(role)"
                          >
                            {{ role.rolename }}
                          </el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-header>
      <el-container style="width: 1250px; height: 100vh; overflow-x: hidden; margin: 0 auto">
        <el-aside
          width="200px"
          style="
            height: 100%;
            background-color: #fff;
            box-shadow: 0px 0px 15px 0px rgba(0, 30, 56, 0.07);
          "
        >
          <!-- 使用 el-scrollbar 包裹 el-menu，设置高度为 70% -->

          <!--页面左侧导航栏-->

          <div style="height: 100%; position: relative; background-color: var(--bg-sidebar)">
            <div v-if="isSHow" class="instrutor"></div>
            <el-scrollbar>
              <el-menu :default-active="defaultActive">
                <template v-for="(menu, index) in filteredMenus">
                  <!-- <div>{{ menu }}</div> -->
                  <!-- 二级菜单 -->
                  <el-sub-menu
                    v-if="hasChildren(menu)"
                    :index="menu.id"
                    :key="menu.id"
                    style="border-top: 1px solid #efefef; position: relative"
                  >
                    <template #title>
                      <!--0822有更改-->
                      <img src="@/assets/images/redraw-images/choseIcon.png" class="course-icon" />
                      <div class="titleBox" @click="navigateTo(menu.url)">
                        {{ menu.name }}
                      </div>
                    </template>
                    <template v-for="child in getChildrenMenus(menu)">
                      <!-- 三级菜单 -->
                      <el-sub-menu
                        v-if="hasChildren(child)"
                        :index="child.id"
                        :key="child.id"
                        style="border-top: 1px solid #efefef; position: relative"
                      >
                        <template #title>
                          <img
                            src="@/assets/images/redraw-images/choseSecond.png"
                            class="course-icon"
                          />
                          <div class="childtitleBox" @click="navigateTo(child.url)">
                            {{ child.name }}
                          </div>
                        </template>
                        <el-menu-item
                          v-for="grandchild in getChildrenMenus(child)"
                          :index="grandchild.url"
                          :key="grandchild.id"
                          style="border-top: 1px solid #efefef"
                          @click="navigateTo(grandchild.url)"
                        >
                          <template #title>
                            <img
                              src="@/assets/images/redraw-images/choseThird.png"
                              class="course-icon"
                            />
                            <div class="childtitleBox">{{ grandchild.name }}</div>
                          </template>
                        </el-menu-item>
                      </el-sub-menu>
                      <!-- 无三级菜单 -->
                      <el-menu-item
                        v-else
                        :index="child.url"
                        :key="child.id"
                        style="border-top: 1px solid #efefef"
                        @click="navigateTo(child.url)"
                      >
                        <template #title>
                          <img
                            src="@/assets/images/redraw-images/choseSecond.png"
                            class="course-icon"
                          />
                          <div class="childtitleBox">{{ child.name }}</div>
                        </template>
                      </el-menu-item>
                    </template>
                  </el-sub-menu>
                  <!-- 无二级菜单 -->
                  <el-menu-item
                    v-else
                    :index="menu.url"
                    :key="menu.id"
                    @click="navigateTo(menu.url)"
                    style="border-top: 1px solid #efefef"
                  >
                    <img src="@/assets/images/redraw-images/choseIcon.png" class="course-icon" />
                    <div class="titleBox">
                      {{ menu.name }}
                    </div>
                  </el-menu-item>
                </template>
              </el-menu>
            </el-scrollbar>
          </div>
        </el-aside>

        <el-main
          style="-ms-overflow-style: none; /* IE 和 Edge */ scrollbar-width: none; /* Firefox */"
        >
          <!-- 在 el-main 区域显示路由组件 -->

          <el-card style="max-width: 910px; margin-left: 30px; margin-top: 50px">
            <router-view></router-view>
            <!-- <template #header>
              <div class="card-header">
                <span>Card name</span>
              </div>
            </template>
            <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
            <template #footer>Footer content</template> -->
          </el-card>
          <span
            style="
              display: inline-block;
              width: 257px;
              height: 24px;
              overflow-wrap: break-word;
              color: rgba(85, 129, 173, 1);
              font-size: 18px;
              font-family: MicrosoftYaHei;
              font-weight: normal;
              text-align: left;
              white-space: nowrap;
              line-height: 24px;
              margin-top: 25px;
            "
            >北方工业大学2024&nbsp;CopyRight</span
          >
        </el-main>
      </el-container>
    </el-container>
  </div>

  <el-dialog v-model="changePwdVisible" title="修改密码" width="420" align-center destroy-on-close>
    <el-form
      ref="changePwdRef"
      :model="pwdInfo"
      class="ml-[-1.5vw] grid gap-y-4 mt-2"
      :rules="changePwdRules"
      autocomplete="off"
    >
      <el-form-item prop="currentPwd" class="ml-10 mr-10">
        <div class="flex items-center space-x-2 w-full">
          <span class="whitespace-nowrap mr-2 min-w-[90px]"
            ><span class="text-red-500 mr-1">*</span>当前密码：</span
          >
          <el-input type="password" show-password v-model="pwdInfo.currentPwd" autocomplete="off" />
        </div>
      </el-form-item>
      <el-form-item prop="newPwd" class="ml-10 mr-10">
        <div class="flex items-center space-x-2 w-full">
          <span class="whitespace-nowrap mr-2 min-w-[90px]"
            ><span class="text-red-500 mr-1">*</span>新密码：</span
          >
          <el-input type="password" show-password v-model="pwdInfo.newPwd" autocomplete="off" />
        </div>
      </el-form-item>
      <el-form-item prop="confirmPwd" class="ml-10 mr-10">
        <div class="flex items-center space-x-2 w-full">
          <span class="whitespace-nowrap mr-2 min-w-[90px]"
            ><span class="text-red-500 mr-1">*</span>确认密码：</span
          >
          <el-input type="password" show-password v-model="pwdInfo.confirmPwd" autocomplete="off" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="changePwdVisible = false">取消</el-button>
        <el-button type="primary" @click="changePwd(changePwdRef)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import History from '../../components/History/History.vue';
import '@/assets/css/taildwind.css';
import intro from '@/utils/introConfigure.js';
import { ref, reactive, computed, onMounted, toRaw, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request.js';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { Menu as IconMenu, Message, Setting, Plus, Platform, Right } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus';
import { useProfileStore } from '@/stores/profileStore.js';
import introJs from 'intro.js';
import useInstructor from '@/stores/InstructorStore.js';
import { storeToRefs } from 'pinia';
import useMain from '@/stores/useMain.js';
import '@/assets/css/taildwind.css';
import useHistory from '../../stores/useHistory';

// 查看历史数据
const isOpen = ref(false);

const backToNow = async () => {
  const { nowUsr } = JSON.parse(sessionStorage.getItem('nowUsr'));
  const { code, msg } = await historyStore.fetchLogin({
    ...nowUsr
  });
  if (!(code === 200 && msg === 'success')) {
    ElMessage({ type: 'error', message: msg });
    return;
  }
  setprofile(historyStore.useObj);
  historyStore.setUsr('');
  router.push(historyStore.useObj.homeurl).then(() => {
    window.location.reload(); // 在导航后强制刷新页面
  });
};

const historyStore = useHistory();

const handleClose = value => {
  isOpen.value = value;
};

// 判断是否已新建学期
const InstructorStore = useInstructor();
const { isDefaultTerm } = storeToRefs(InstructorStore);
console.log(isDefaultTerm.value);
const isSHow = ref(isDefaultTerm.value);

// 路由置空
const handleJumpTo = () => {};

// 创建introJS实例
/**************指引框逻辑********************/
const guide = () => {
  intro.setOptions({
    showBullets: false,
    tooltipPosition: 'right',
    doneLabel: '立即前往',
    // skipLabel: 'X',
    steps: [
      {
        element: '.instrutor', // 定位到相应的元素位置，如果不设置element，则默认展示在屏幕中央
        tooltipClass: 'customTooltip',
        title: '欢迎来到智能教学平台', // 标题
        intro: '在使用之前请先创建学期👋' // 内容
      }
    ]
  });
  nextTick(() => {
    intro
      .onexit(() => {
        isSHow.value = false;
        router.push('/homes/secretariatehome/sysmangt/termmangt');
      })
      .start();
  });
};
/**************指引框逻辑********************/

//获取Stroe
const profileStore = useProfileStore();

const defaultActive = ref('not-selected');
const route = useRoute();
const router = useRouter(); // 获取路由实例
const imageUrl = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
const currentterm = ref('');

// const imageUrl = ref('')

const handleHistory = () => {
  isOpen.value = true;
};

// 定义处理上传成功的函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response, // 上传成功后的响应数据
  uploadFile // 上传的文件对象
) => {
  // 使用 FileReader API 创建一个临时的 URL，以便可以在网页上查看图片
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};
// 定义上传前的检查函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  // 检查文件类型是否为 JPEG 或 PNG 格式
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    // 如果不是 JPEG 或 PNG 格式，则弹出错误消息
    ElMessage.error('Avatar picture must be JPG or PNG format!');
    // 并返回 false 阻止上传操作
    return false;
  } else if (rawFile.size / 1024 / 1024 > 5) {
    // 检查文件大小是否不超过 2MB
    ElMessage.error('Avatar picture size can not exceed 5MB!');
    return false;
  }
  // 如果文件格式和大小都符合要求，则返回 true 允许上传
  return true;
};

// 清除登录信息的方法
function clearLoginInfo() {
  // 清除其他可能存储的信息
  sessionStorage.removeItem('users');
  sessionStorage.removeItem('isLoggedIn');
}

//登出的方法
const handleLogout = () => {
  historyStore.setUsr('');
  MainStore.setSelectedRoute('');
  clearLoginInfo();
  router.push({ name: 'Login' }); // 假设您的登录路由的名字是 'Login'
};

// 默认显示菜单
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
  return (
    menus.value
      .filter(menu => !excludedPids.includes(menu.pid))
      //0311加入菜单按顺序排列
      .sort((a, b) => a.orderno - b.orderno)
  );
});

//过滤节点是否有孩子节点
const hasChildren = menu => {
  // console.log(menu);
  if (menu.children && menu.children.length > 0) return true;
  return false;
  // return menus.value.some(child => child.pid === menu.id);
};
//获取节点的孩子节点
const getChildrenMenus = menu => {
  return menu.children;
};
//路由导航
const MainStore = useMain();
const navigateTo = url => {
  //前面拼一个/表示绝对路径
  if (!url) return;
  console.log(homeurl.value + url);
  MainStore.setSelectedRoute(homeurl.value + url);
  router.push(homeurl.value + url);
};

const roleList = ref([]);
const showRoles = ref(false);
const loginuserFrom = ref({
  id: '',
  roleid: '',
  obsid: '',
  obsdeep: '',
  catelog: ''
});

//切换角色
const getRolelist = e => {
  e.stopPropagation();

  request.admin
    .post(`/homes/switchrole`)
    .then(res => {
      if (res.code === 200 && res.data.length > 0) {
        showRoles.value = true;
        roleList.value = res.data;
        roleList.value.sort((a, b) => b.rolename.length - a.rolename.length);
      } else {
        ElMessage({
          type: 'error',
          message: '获取角色列表失败或列表为空'
        });
      }
    })
    .catch(error => {
      ElMessage({
        type: 'error',
        message: '获取角色列表失败'
      });
    });
};

const switchRole = role => {
  // 保存路由进行置空
  MainStore.setSelectedRoute('');
  console.log(`切换到角色: ${role.roleid}`);
  // 切换角色的逻辑
  loginuserFrom.value.id = role.id;
  loginuserFrom.value.roleid = role.roleid;
  loginuserFrom.value.rolename = role.rolename;
  loginuserFrom.value.obsid = role.obsid;
  loginuserFrom.value.obsdeep = role.obsdeep;
  userlogin(loginuserFrom);
  showRoles.value = false;
};

//--------修改密码
const changePwdVisible = ref(false);
const pwdInfo = ref({
  currentPwd: '',
  newPwd: '',
  confirmPwd: ''
});
const changePwdRef = ref<FormInstance>();

const openChangePwdDialog = () => {
  pwdInfo.value = {
    currentPwd: '',
    newPwd: '',
    confirmPwd: ''
  };
  changePwdVisible.value = true;
};

const validateNew = (rule: any, value: String, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'));
  } else {
    if (value.length < 3 || value.length > 15) callback(new Error('密码长度在3到15个字符之间'));
    callback();
  }
};
const validateConfirm = (rule: any, value: String, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'));
  } else if (value !== pwdInfo.value.newPwd) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const changePwdRules = ref({
  currentPwd: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPwd: [{ required: true, validator: validateNew, trigger: 'blur' }],
  confirmPwd: [{ required: true, validator: validateConfirm, trigger: 'blur' }]
});

const changePwd = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (valid) {
      try {
        const res = await request.admin.get(
          `/homes/teacherChangePwd?currentPwd=${pwdInfo.value.currentPwd}&newPwd=${pwdInfo.value.newPwd}`
        );
        if (res.code === 200) {
          ElMessage.success('修改成功');
          changePwdVisible.value = false;
        } else ElMessage.error(res.msg);
      } catch (error) {
        ElMessage.error('修改失败' + error);
      }
    } else {
      return;
    }
  });
};

const userlogin = loginuserFrom => {
  request.admin
    .post('/login/user', loginuserFrom.value)
    .then(res => {
      console.log(res);
      if (res.code === 200) {
        console.log('userlogin_success');
        setprofile(res.data);
        router.push(res.data.homeurl).then(() => {
          window.location.reload(); // 在导航后强制刷新页面
        });
      } else if (res.code === 404) {
        router.push('/login');
      }
    })
    .catch(error => {
      // 登录失败
      ElMessage({
        type: 'error',
        message: '登录失败'
      });
    });
};

const setprofile = data => {
  profileStore.setProfileInfo(
    data.username,
    data.rolename,
    data.catelog,
    data.homeurl,
    data.token,
    data.currentterm
  );
  const userInfo = {
    username: data.username,
    rolename: data.rolename,
    catelog: data.catelog,
    homeurl: data.homeurl,
    token: data.token,
    currentterm: data.currentterm
  };

  sessionStorage.setItem('users', JSON.stringify(userInfo));
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('token', data.token);
};

const handleVisibleChange = visible => {
  if (!visible && showRoles.value) {
    // 当下拉菜单关闭时，重置状态
    showRoles.value = false;
  }
};

//钩子函数用来刷新后重新获取数据
onMounted(() => {
  // guide();
  nextTick(() => {
    if (isDefaultTerm.value && route.fullPath === '/homes/secretariatehome') {
      guide();
    } else {
      isSHow.value = false;
    }
  });
  defaultActive.value = 'not-selected';
  const role = route.params.rolehome; // 获取当前路由参数中的 rolehome 值
  const basePath = `/homes/${role}`;
  if (route.path !== basePath) {
    router.replace(basePath); // 重定向到基础路径
  }

  const storedUserInfo = sessionStorage.getItem('users');
  if (storedUserInfo) {
    const userInfo = JSON.parse(storedUserInfo);
    //设置当前学期
    currentterm.value = userInfo.currentterm;
    // 更新用户信息到Pinia
    // console.log("term",userInfo.currentterm)
    profileStore.setProfileInfo(
      userInfo.username,
      userInfo.rolename,
      userInfo.catelog,
      userInfo.homeurl,
      userInfo.token,
      userInfo.currentterm
    );
    loginInfo.username = profileStore.profilename;
    loginInfo.rolename = profileStore.profilerolename;
    loginInfo.catelog = profileStore.profilecatelog;
  } else {
    // 如果没有存储的用户信息，可以重定向到登录页面或显示提示信息

    sessionStorage.removeItem('users');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');

    // router.push({ name: 'Login' });

    // 或
    // ElMessage.error('请重新登录');
  }
  //获取完pinia中的数据后重新重定向到父页面
  // router.push(homeurl.value);

  // request.admin.post(`${homeurl}`,loginInfo)
  // console.log(1111)
  //获取菜单栏的数据
  request.admin
    .post(`/homes/teacherhome`)
    .then(res => {
      console.log(res);
      console.log('defaultActive', defaultActive.value);
      // 登录成功

      if (res.code === 200 && res.data.length > 0) {
        menus.value = res.data;
      }
    })
    .catch(error => {
      // 获取失败
      ElMessage({
        type: 'error',
        message: '获取导航失败'
      });
    });
});
</script>

<style lang="less" scoped>
.course-icon {
  height: 20px;
  margin-right: 10px;
}

.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-wrap: nowrap;

  .item {
    font-family: monospace;
    /* 等宽字体 */
    font-size: 16px;
    margin-bottom: 30px;
    height: 35px;
    line-height: 35px;
    width: 100%;
    cursor: pointer;
    text-align: center;
    color: #fff;
    font-weight: 400;
    transition: background-color 0.5s ease, color 0.5s ease;

    &:hover {
      background-color: #2ecc71;
      /* 悬停时背景颜色 */
      color: #ecf0f1;
      /* 悬停时文字颜色 */
    }
  }
}

:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  font-size: 16px;
  color: var(--text-primary);
  background-color: var(--bg-card);

  &:hover {
    background-color: var(--hover-bg);
  }
}

:deep(.el-sub-menu.is-opened .el-menu-item) {
  color: var(--text-primary);

  &:hover {
    background-color: var(--hover-bg);
  }
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(212, 240, 255, 1) !important;
  color: var(--text-primary);
}

.header {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/redraw-images/bg2.png') 100% no-repeat;
  background-size: 100% 100%;

  :deep(.el-avatar):hover {
    outline: none !important;
  }
}

.customTooltip * {
  color: #4a4a4a;
  font-size: 18px;
}

.customTooltip .introjs-tooltip-title {
  color: #0a41c9;
}

.instrutor {
  position: absolute;
  z-index: 999;
  width: 160px;
  height: 55px;
  padding: 0 20px;
  text-align: center;
  line-height: 55px;
}

// .childtitleBox,
// .titleBox {
//   width: 177px;
//   height: 60px;
//   // margin: 0 auto;
//   position: absolute;
//   left: 0;
// }

// .childtitleBox {
//   left: 20px;
// }

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

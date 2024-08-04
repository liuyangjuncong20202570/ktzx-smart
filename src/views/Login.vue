<template>
  <el-container style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <el-header></el-header>
    <el-container class="background-image">
      <el-aside style="width: 63vw"></el-aside>
      <el-main style="display: flex; align-items: center;">
        <div class="container_bai"
             style="width:45%;min-width:14vw; height:auto; margin: 0 auto; background-color:white; border-radius:10px; padding:20px;"
             @keyup.enter="login">
          <el-tabs v-model="loginForm.catelog" class="container_tabs" @tab-click="handleClick" stretch>
            <el-tab-pane label="学生登录" name="1">
              <div style="height: auto;">
                <el-radio-group v-model="loginForm.loginway" style="display: flex; justify-content: space-around;">
                  <el-radio label="1" style="margin: 0">用户名密码登录</el-radio>
                  <el-radio label="2" style="margin: 0">手机短信登录</el-radio>
                </el-radio-group>
              </div>
              <el-form :model="loginForm" :rules="rules" ref="ruleFormRef" size="large">
                <el-form-item prop="loginname">
                  <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginForm.loginname"
                            :rules="rules.loginname">
                  </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                  <el-input :prefix-icon="Lock" placeholder="请输入密码" v-model="loginForm.pwd"
                            :rules="rules.pwd" show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" style="width: 100%;" @click="login">登录</el-button>
                  <el-dialog :modelValue="showRoleModal" :show-close="false" :close-on-click-modal="false"
                             title="选择角色" width="30%" style="border-radius:10px">
                    <el-radio-group v-model="selectedRoleId">
                      <el-radio v-for="role in roledata.simpleRoleList" :key="role.roleid"
                                :label="role.roleid">{{role.rolename}}
                      </el-radio>
                    </el-radio-group>
                    <template #footer>
                      <el-button @click="showRoleModal = false">取消</el-button>
                      <el-button type="primary" @click="confirmRole">确认</el-button>
                    </template>
                  </el-dialog>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="教师登录" name="2">
              <div style="height: auto">
                <el-radio-group v-model="loginForm.loginway" style="display: flex; justify-content: space-around;">
                  <el-radio label="1" style="margin: 0">用户名密码登录</el-radio>
                  <el-radio label="2" style="margin: 0">手机短信登录</el-radio>
                </el-radio-group>
              </div>
              <el-form :model="loginForm" :rules="rules" ref="ruleFormRef" size="large">
                <el-form-item prop="loginname">
                  <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginForm.loginname"
                            :rules="rules.loginname">
                  </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                  <el-input :prefix-icon="Lock" placeholder="请输入密码" v-model="loginForm.pwd"
                            :rules="rules.pwd" show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" style="width: 100%;" @click="login">登录</el-button>
                  <el-dialog :modelValue="showRoleModal" :show-close="false" :close-on-click-modal="false"
                             title="选择角色" width="30%" style="border-radius:10px">
                    <el-radio-group v-model="selectedRoleId">
                      <el-radio v-for="role in roledata.simpleRoleList" :key="role.roleid"
                                :label="role.roleid">{{role.rolename}}
                      </el-radio>
                    </el-radio-group>
                    <template #footer>
                      <el-button @click="showRoleModal = false">取消</el-button>
                      <el-button type="primary" @click="confirmRole">确认</el-button>
                    </template>
                  </el-dialog>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
    <el-footer style="vertical-align: top;">北方工业大学 @ 2024版权所有</el-footer>
  </el-container>
</template>
<script setup>
import {ref, reactive, getCurrentInstance, onMounted} from 'vue'
import {User, Lock, Edit} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import request from '../utils/request.js'
import router from "../router/index.js";
import {useProfileStore} from "../stores/profileStore.js";

const profileStore = useProfileStore();

const loginForm = reactive({
  loginname: "",
  pwd: "",
  catelog: "1",
  loginway: "1",
})

const loginuserFrom = ref({
  id: "",
  roleid: "",
  obsid: "",
  obsdeep: "",
  catelog: ""
})

const StudentOrTeacher = ref(true);
const {proxy} = getCurrentInstance()

const showRoleModal = ref(false);

const handleClick = (tab, event) => {
  const iAgree = document.querySelector(".form_footer");
  if (iAgree) {
    if (loginForm.catelog === "2") {
      StudentOrTeacher.value = true;
      iAgree.style.display = "none";
    } else if (loginForm.catelog === "1") {
      StudentOrTeacher.value = false;
      iAgree.style.display = "block";
    }
  }
}

const roledata = reactive({});
const selectedRoleId = ref(null);

const rules = reactive({
  loginname: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 15, message: '用户名长度在3到15个字符之间', trigger: 'blur'}
  ],
  pwd: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3, max: 15, message: '密码长度在3到15个字符之间', trigger: 'blur'},
  ],
})

const login = () => {
  proxy.$refs.ruleFormRef.validate((valid) => {
    if (valid) {
      request.admin.post('/login', loginForm)
          .then(res => {
            if (res.code === 200) {
              const rolesCount = res.data.rolescount;
              loginuserFrom.value.id = res.data.userid;
              loginuserFrom.value.catelog = res.data.catelog;

              const logincatelog = res.data.catelog;
              if (logincatelog === '1') {
                setprofile(res.data);
                router.push(res.data.homeurl);
                // router.push('/page');

              } else {
                if (rolesCount === 1) {
                  loginuserFrom.value.roleid = res.data.simpleRoleList[0].roleid;
                  loginuserFrom.value.obsid = res.data.simpleRoleList[0].obsid;
                  loginuserFrom.value.obsdeep = res.data.simpleRoleList[0].obsdeep;
                  userlogin()
                } else {
                  Object.assign(roledata, res.data);
                  showRoleModal.value = true;
                }
              }
            }

          }).catch(error => {
        ElMessage({
          type: 'error',
          message: '登录失败'
        });
      });
    } else {
      ElMessage({
        type: 'error',
        message: '用户名或密码错误'
      });
    }
  });
};

const confirmRole = () => {
  const selectedRole = roledata.simpleRoleList.find(role => role.roleid === selectedRoleId.value);
  if (selectedRole) {
    loginuserFrom.value.roleid = selectedRole.roleid;
    loginuserFrom.value.obsid = selectedRole.obsid;
    loginuserFrom.value.obsdeep = selectedRole.obsdeep;
  }
  userlogin()
  showRoleModal.value = false;

};

const userlogin = () => {
  request.admin.post('/login/user', loginuserFrom.value)
      .then(res => {
        if (res.code === 200) {
          setprofile(res.data)
          router.push(res.data.homeurl);
          // router.push('/page');
        } else if (res.code === 404) {
          router.push('/login');
        }

      })
      .catch(error => {
        ElMessage({
          type: 'error',
          message: '登录失败'
        });
      })
}

const setprofile = (data) => {
  profileStore.setProfileInfo(
      data.username
      , data.rolename
      , data.catelog
      , data.homeurl
      , data.token
      , data.currentterm);
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
}

onMounted(() => {
  sessionStorage.removeItem('users');
})
</script>

<style scoped>
.el-header,
.el-footer {
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-image {
  background-image: url('../assets/images/login.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 95vw;
}
</style>

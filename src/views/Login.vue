<template>
  <el-container style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <!--header-->
    <el-header></el-header>
    <!--中间部分-->
    <el-container class="background-image">
      <!--中间左边部分-->
      <el-aside style="width: 63vw"></el-aside>
      <!--中间右边部分-->
      <el-main style="display: flex; align-items: center;">
        <!--白框-->
        <div class="container_bai"
             style="width:45%;min-width:14vw; height:auto; margin: 0 auto; background-color:white; border-radius:10px; padding:20px;"
             @keyup.enter="login">
          <!--切换账号登录-->
          <el-tabs v-model="loginForm.catelog" class="container_tabs" @tab-click="handleClick" stretch>
            <!--学生账号登录-->
            <el-tab-pane label="学生登录" name="1">
              <!--选择登录方式-->
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
                  <el-button type="primary" v-blur-on-click style="width: 100%;" @click="login">登录</el-button>

                  <!-- 弹窗登录-->

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

            <!--老师账号登录-->
            <el-tab-pane label="教师登录" name="2">
              <!--选择登录方式-->

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
                  <el-button type="primary" v-blur-on-click style="width: 100%;" @click="login">登录</el-button>
                  <!-- 弹窗登录-->
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

//构造登录表单
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

//学生登录/老师登录（true为学生登录）
const StudentOrTeacher = ref(true);
//调用getCurrentInstance()方法来获取当前组件实例的代理对象
const {proxy} = getCurrentInstance()

//弹窗是否显示
const showRoleModal = ref(false);

//点击切换学生登录/教师登录
const handleClick = (tab, event) => {
  const iAgree = document.querySelector(".form_footer");
  if (iAgree) {
    if (loginForm.catelog === "2") {// 教师登录
      StudentOrTeacher.value = true;
      iAgree.style.display = "none";
    } else if (loginForm.catelog === "1") {// 学生登录

      StudentOrTeacher.value = false;
      iAgree.style.display = "block";
    }
  }
}

const roledata = reactive({});
const selectedRoleId = ref(null);
//默认选择第一个角色序号
// const selectedRoleId = ref(data.simpleRoleList[0].roleid);

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
//登录
const login = () => {
  console.log("loginForm",loginForm)
  // 验证表单输入
  proxy.$refs.ruleFormRef.validate((valid) => {
    if (valid) {
      //请求登录接口
      request.admin.post('/login', loginForm)
          .then(res => {
            // 登录成功
            if (res.code === 400) {
              ElMessage({
                type: 'error',
                message: res.msg,
              });
            } else if (res.code === 200) {
              //处理不同角色的跳转逻辑
              const rolesCount = res.data.rolescount;
              loginuserFrom.value.id = res.data.userid;
              loginuserFrom.value.catelog = res.data.catelog;

              const logincatelog = res.data.catelog;

              console.log("logincatelog", logincatelog)
              if (logincatelog === '1') {
                console.log(res.data)
                setprofile(res.data);
                router.push(res.data.homeurl);

              } else {
                if (rolesCount === 1) {
                  loginuserFrom.value.roleid = res.data.simpleRoleList[0].roleid;
                  loginuserFrom.value.obsid = res.data.simpleRoleList[0].obsid;
                  loginuserFrom.value.obsdeep = res.data.simpleRoleList[0].obsdeep;
                  userlogin()
                } else {
                  Object.assign(roledata, res.data);
                  //打开弹窗选择角色
                  showRoleModal.value = true;
                }
              }
            }
          }).catch(error => {

        // 登录失败

        ElMessage({
          type: 'error',
          message: '登录失败'
        });
      });
    } else {

      // 输入无效

      ElMessage({
        type: 'error',
        message: '用户名或密码错误'
      });
    }
  });
};



//弹窗选择角色信息

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
//二次请求
const userlogin = () => {
  console.log("userlogin")
  request.admin.post('/login/user', loginuserFrom.value)
      .then(res => {
        console.log(res)
        if (res.code === 200) {
          console.log("userlogin_success")
          setprofile(res.data)

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
      })
}


//存入本地 sessionStorage

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
  /*background-color: #646cff;*/
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-image {

  /* 设置背景图片 */
  background-image: url('../assets/images/login.jpg');
  /* 其他的背景样式，例如背景重复、位置等 */

  background-repeat: no-repeat;
  background-size: cover;
  width: 95vw;
}
</style>

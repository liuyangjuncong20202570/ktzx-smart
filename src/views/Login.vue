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
        <div style="width:16vw; height:auto; margin: 0 auto; background-color:white; border-radius:10px; padding:20px;" @keyup.enter="login">
          <!--切换账号登录-->
          <el-tabs v-model="loginForm.catelog" class="demo-tabs" @tab-click="handleClick" stretch>
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
                            v-rules="rules.loginname">
                  </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                  <el-input :prefix-icon="Lock" placeholder="请输入密码" v-model="loginForm.pwd"
                            v-rules="rules.pwd" show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" style="width: 100%;" @click="login">登录</el-button>
                  <!-- 弹窗登录-->
                  <el-dialog :modelValue="showRoleModal" :show-close="false" :close-on-click-modal="false"
                             title="选择角色" width="30%" style="border-radius:10px">
                    <el-radio-group v-model="selectedRoleId">
                      <el-radio v-for="role in data.simpleRoleList" :key="role.roleid"
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
                  <el-button type="primary" style="width: 100%;" @click="login">登录</el-button>
                  <!-- 弹窗登录-->
                  <el-dialog :modelValue="showRoleModal" :show-close="false" :close-on-click-modal="false"
                             title="选择角色" width="30%" style="border-radius:10px">
                    <el-radio-group v-model="selectedRoleId">
                      <el-radio v-for="role in data.simpleRoleList" :key="role.roleid"
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


const data = reactive({});

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
  // 验证表单输入
  proxy.$refs.ruleFormRef.validate((valid) => {
    if (valid) {
      //请求登录接口
      request.post('/login', loginForm)
          .then(res => {
            // console.log(res);
            // 登录成功
            if (res.code === 200) {
              //处理不同角色的跳转逻辑
              // profileStore.setProfilename(loginForm.loginname);
              const rolesCount = res.data.rolescount;
              if (rolesCount === 1) {
                // 跳转至指定页面

                const HomeUrl = res.data.simpleRoleList[0].homeurl;

                //将登录用户基本信息存储pinia
                profileStore.setProfileInfo(res.data.userid,res.data.username,loginForm.loginname,res.data.simpleRoleList[0].roleid,res.data.simpleRoleList[0].rolename,res.data.catelog,res.data.simpleRoleList[0].homeurl);

                //将用户信息格式化然后本地存储：0310
                const userInfo = {
                  userId: res.data.userid,
                  userName:res.data.username,
                  loginName: loginForm.loginname,
                  roleId: res.data.simpleRoleList[0].roleid,
                  roleName: res.data.simpleRoleList[0].rolename,
                  catelog: res.data.catelog,
                  homeUrl: res.data.simpleRoleList[0].homeurl
                };
                sessionStorage.setItem('users', JSON.stringify(userInfo));
                sessionStorage.setItem('isLoggedIn', 'true');
                router.push(HomeUrl);
              } else {
                //显示弹窗
                Object.assign(data, res.data);
                // console.log(data);
                showRoleModal.value = true;
              }
            } else {
              // 登录失败
              ElMessage({
                type: 'error',
                message: res.msg
              });
            }
          })
          .catch(error => {
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

const selectedRoleId = ref(null);

//登录验证跳转
const confirmRole = () => {
  const selectedRole = data.simpleRoleList.find(role => role.roleid === selectedRoleId.value);
  if (selectedRole) {
    profileStore.setProfileInfo(data.userid,data.username,loginForm.loginname,selectedRole.roleid,selectedRole.rolename,data.catelog,selectedRole.homeurl);
    // 将用户信息格式化然后本地存储：0310
    const userInfo = {
      userId: data.userid,
      userName: data.username,
      loginName: loginForm.loginname,
      roleId:  selectedRole.roleid,
      roleName: selectedRole.rolename,
      catelog: data.catelog,
      homeUrl: selectedRole.homeurl
    };
    sessionStorage.setItem('users', JSON.stringify(userInfo));
    sessionStorage.setItem('isLoggedIn', 'true');
    router.push(selectedRole.homeurl);
  }
  showRoleModal.value = false;
};
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

}</style>

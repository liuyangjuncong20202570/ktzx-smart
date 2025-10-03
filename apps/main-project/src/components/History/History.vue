<template>
  <el-dialog v-model="props.isOpen" title="查看历史学期" width="500" :before-close="handleClose">
    <div class="h-[600px] overflow-y-auto no-scrollbar">
      <el-collapse class="h-full" v-model="activeNames" :before-collapse="beforeCollapse">
        <template
          v-if="historyList.length !== 0"
          v-for="(item, index) in historyList"
          :key="item.id"
        >
          <el-collapse-item
            class="my-5 hover:bg-none bg-white rounded-xl shadow-md p-6 mb-4"
            :title="item.termName"
            :name="item.id"
          >
            <template
              v-for="iten in item.simpleRoleList.filter(
                (s, index, self) => index === self.findIndex(t => t.roleid === s.roleid)
              )"
              :key="iten.id"
            >
              <div
                class="flex items-center gap-2 text-base leading-8 text-gray-800 font-medium cursor-pointer"
                @click="handleJump(iten)"
              >
                <i class="text-blue-500" v-if="iten.rolename.includes('主任')">🛡️</i>
                <i class="text-green-500" v-else-if="iten.rolename.includes('任课教师')">👨‍🏫</i>
                <i class="text-yellow-500" v-else-if="iten.rolename.includes('负责人')">📌</i>
                <i class="text-purple-500" v-else-if="iten.rolename.includes('实验教师')">📊</i>
                <i class="text-gray-500" v-else>📁</i>
                <span class="leading-none">{{ iten.rolename }}</span>
              </div>
            </template>
          </el-collapse-item>
        </template>
        <template v-else>
          <div
            class="flex h-full items-center justify-center gap-2 text-base leading-8 text-gray-800 font-medium cursor-pointer"
          >
            <div class="leading-none h-full flex items-center justify-center">暂无相关角色</div>
          </div>
        </template>
      </el-collapse>
    </div>
  </el-dialog>
</template>

<script setup>
import { useProfileStore } from '@/stores/profileStore.js';
import '@/assets/css/taildwind.css';
import { computed, ref, reactive } from 'vue';
import { onMounted } from 'vue';
import useHistory from '../../stores/useHistory';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import parseJWT from '../../utils/parseJWT';

/* ********************变量定义******************** */
// props定义
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});
// 普通变量

const profileStore = useProfileStore();

const loginInfo = reactive({
  username: profileStore.profilename,
  rolename: profileStore.profilerolename,
  catelog: profileStore.profilecatelog,
  currentterm: profileStore.currentterm
});

const router = useRouter();

const loginuserFrom = ref({
  id: '',
  roleid: '',
  obsid: '',
  obsdeep: '',
  catelog: '',
  termid: ''
});

const historyList = ref([]);

// pinia状态管理
const historyStore = useHistory();

const fetchList = async () => {
  const { code, msg } = await historyStore.fetchHistoryList();
  if (!(code === 200 && msg === 'success')) return;
  historyList.value = historyStore.historyList;
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

const handleJump = async scope => {
  console.log(scope);
  const usr = JSON.parse(sessionStorage.getItem('users'));
  const tokenInfo = parseJWT(sessionStorage.getItem('token'));
  historyStore.setUsr({
    id: tokenInfo.id,
    roleid: tokenInfo.roleid,
    obsid: tokenInfo.obsid,
    obsdeep: tokenInfo.obsdeep,
    catelog: usr.catelog
  });
  loginuserFrom.value.id = scope.id;
  loginuserFrom.value.roleid = scope.roleid;
  loginuserFrom.value.rolename = scope.rolename;
  loginuserFrom.value.obsid = scope.obsid;
  loginuserFrom.value.obsdeep = scope.obsdeep;
  const token = sessionStorage.getItem('token');
  loginuserFrom.value.termid = token;

  const { code, msg } = await historyStore.fetchLogin(loginuserFrom.value);
  if (!(code === 200 && msg === 'success')) {
    ElMessage({ type: 'error', message: msg });
    return;
  }
  setprofile(historyStore.useObj);
  router.push(historyStore.useObj.homeurl).then(() => {
    window.location.reload(); // 在导航后强制刷新页面
  });
};

onMounted(async () => {
  fetchList();
});

/* ********************方法定义******************** */

const emit = defineEmits('close');

const handleClose = () => {
  emit('close', false);
};
</script>

<style lang="less" scoped>
:deep(.el-collapse-item) {
  button {
    border-color: transparent !important;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none !important;
}
.no-scrollbar {
  -ms-overflow-style: none !important; /* IE 10+ */
  scrollbar-width: none !important; /* Firefox */
}

:deep(.el-collapse-item__header) {
  font-size: 1.25rem !important;
  color: #1f2937 !important;
  margin-bottom: 0.5rem !important;
}
</style>

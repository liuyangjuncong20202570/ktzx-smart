<template>
  <el-dialog v-model="props.isOpen" title="查看历史学期" width="500" :before-close="handleClose">
    <div class="h-[600px] overflow-y-auto no-scrollbar">
      <el-collapse v-model="activeNames" :before-collapse="beforeCollapse">
        <template v-for="(item, index) in historyList" :key="item.id">
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
  catelog: ''
});

//  const historyList = ref([])
const historyList = ref([
  {
    id: '1653708435-3d2a2df2-73d9-423b-afc7-1b7ab4c1dfc3',
    termName: '2024年秋',
    simpleRoleList: [
      {
        id: '1',
        roleid: '516761049-916b5c26-ea1d-4f50-8e57-fe7c2e3aaf60',
        rolename: '计算机科学与技术专业负责人',
        obsid: '1597933787-ed408ed1-e85e-45dd-9741-c70372ba6a43',
        obsdeep: 4
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '数据结构课堂-任课教师',
        obsid: '292104772-9c9f88f0-7af9-438c-a117-e2efc2020b7b',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-de9ae949-6bfb-4314-be59-8b1f3c2626e4',
        rolename: '信息学院负责人',
        obsid: '1597933787-7680d2e7-775a-44ba-8cd8-7884f2c6fab6',
        obsdeep: 2
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '网页开发-任课教师',
        obsid: '292104772-bd746949-dc9b-4a63-9ba6-68886ac6f1ab',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: 'java程序设计-任课教师',
        obsid: '292104772-eb2b9854-acf8-4389-9e3d-7fddd1fb20f4',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '数据结构课堂2-任课教师',
        obsid: '292104772-4c2dfeb4-e409-45a3-a1cb-ede470da1ae8',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '单片机-任课教师',
        obsid: '292104772-15eaf889-eda8-4226-acf8-eb5a6b6fad46',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-bac1cf5a-5360-4caa-b062-3e2800bdfd58',
        rolename: '计算机系主任',
        obsid: '1597933787-07f7b4d3-1c29-4e61-9dd9-cae8d6149842',
        obsdeep: 3
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '测试课堂-任课教师',
        obsid: '292104772-9ea2676c-0bf6-4d78-88cc-f441b197f29c',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2024秋-数据结构-课程负责人',
        obsid: '1508003654-abbeeeba-9e13-4d5e-b0c2-254bdda7c4c9',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-d19230c8-c355-4d67-9206-e8de189d5148',
        rolename: '数据结构课堂-实验教师',
        obsid: '292104772-9c9f88f0-7af9-438c-a117-e2efc2020b7b',
        obsdeep: -1
      }
    ]
  },
  {
    id: '1653708435-8f0152d1-0689-4aa0-91c6-992a759ef391',
    termName: '2025年春',
    simpleRoleList: [
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '实验测试课堂-任课教师',
        obsid: '292104772-2964542e-fada-49f5-9a01-d6adb971c2c3',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-234512f3-7c19-4580-abe2-ebfb1dd8db21',
        rolename: '2025春-数据结构-课程负责人',
        obsid: '1508003654-ea23b397-4cf0-466a-823d-15288c8f3657',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '2023春-数据库原理-任课教师',
        obsid: '292104772-38b6a749-bf7c-4503-88b8-d08842a25297',
        obsdeep: -1
      },
      {
        id: '1',
        roleid: '516761049-a74a69b4-427d-4d7f-addb-521d0a493f8f',
        rolename: '2023单片机-任课教师',
        obsid: '292104772-ef4d9904-a146-4e60-9342-110c442212e3',
        obsdeep: -1
      }
    ]
  },
  {
    id: '0',
    termName: '全部',
    simpleRoleList: [
      {
        id: '1',
        roleid: '516761049-812a1a24-365d-4697-ab16-b0093b983624',
        rolename: '超级管理员',
        obsid: '237675254',
        obsdeep: 1
      },
      {
        id: '1',
        roleid: '516761049-459623f8-04cc-4066-8fa8-99f9101450d6',
        rolename: '教务处',
        obsid: '237675254',
        obsdeep: 1
      },
      {
        id: '1',
        roleid: '516761049-c4227aca-9e02-4706-840d-d5fc85550e24',
        rolename: '教学秘书',
        obsid: '237675254',
        obsdeep: 1
      },
      {
        id: '1',
        roleid: '516761049-e8473133-b6c3-43e4-9a72-9e5a265ba9e4',
        rolename: '实验秘书',
        obsid: '237675254',
        obsdeep: 1
      }
    ]
  }
]);

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

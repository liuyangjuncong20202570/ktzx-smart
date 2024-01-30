<template>
	<div style="height: 100vh;">
		<el-container class="layout-container-demo" style="height: 100%;">
			<el-header style="position: relative; text-align:right; background-color: #0064B1; font-size: 15px; height: 8%">
				<!--右侧按钮-->
				<div style="display: flex; align-items: center; justify-content: center; height: 100%; right: 20px;">
					<!--标题的div background-color: red;-->
					<div class="left-div" style="float: left; margin-right: auto; display: flex;">
						<img src="../assets/images/logo.png" style="height:5.5vh; float: left;" />
						<el-text style="font-size:19px; margin-left:10px; color:white">XXX专业智能教学平台</el-text>
					</div>
					<!--头像-->
					<el-dropdown>
						<el-avatar style="margin-right:20px"
							src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item>查看详情</el-dropdown-item>
								<el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<!--人名 -->
					<el-text class="mx-1" size="large" style="color:white">管理员</el-text>
				</div>
			</el-header>

			<el-container>
				<el-aside width="200px">

					<div style="width: 100%; height: auto; padding: 10px 0; background-color: #c8c9cc; display: flex; align-items: center;">
						<!--头像-->
						<div style="width: 72px; height: 112px; margin-left: 10px;">
							<el-upload style="width: 100%; height: 100%; display: flex;" class="avatar-uploader"
								action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false"
								:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
								<!-- action属性指定了文件上传的目标服务器地址 -->
								<!-- show-file-list属性设置为false，表示不显示已选择的文件列表 -->
								<!-- on-success属性是一个事件回调函数，当文件上传成功时，该函数将被调用 -->
								<!-- before-upload属性是一个事件回调函数，当文件准备上传时，该函数将被调用 -->
								<!-- 如果imageUrl有值，则显示这个图片，否则不显示 -->
								<img v-if="imageUrl" :src="imageUrl" class="avatar" />
								<!--                <el-icon v-else style="width:72px; height: 100%" ><Plus /></el-icon>-->
								<!-- 如果imageUrl没有值，则显示提示文本-->
								<el-text v-else size="small" style="width:72px;color:white">点击上传头像</el-text>
							</el-upload>
						</div>
						<div style="width: 88px; margin: 0 15px 0 15px">
							<el-row :gutter="0">
								<p style="font-size:20px;margin-left:2px;line-height:0.1;">管理员</p>
							</el-row>
							<el-row :gutter="0">
								<p style="font-size:14px;margin-left: 2px;line-height:0.5;">超级管理员</p>
							</el-row>
							<el-row :gutter="0" style="height:20px;margin-top: 20px">
								<el-col :span="5">
									<el-icon style="float:left;margin-top:2px;margin-left:1px;color:blue">
										<Platform />
									</el-icon>
								</el-col>
								<el-col :span="7" style="">
									<p style="font-size:10px;line-height:0">在线</p>
								</el-col>
								<el-col :span="5">
									<el-icon style="float:left;margin-top:2px;margin-left:3px">
										<Right />
									</el-icon>
								</el-col>
								<el-col :span="7" style="">
									<p style="font-size:10px;line-height:0">注销</p>
								</el-col>
							</el-row>
						</div>
					</div>
					<!-- 使用 el-scrollbar 包裹 el-menu，设置高度为 70vh -->
					<el-scrollbar style="height: 70%">
						<el-menu :default-active="defaultActive">
							<template v-for="menu in filteredMenus">
								<el-sub-menu v-if="hasChildren(menu)" :index="menu.id" :key="menu.id">
									<template #title>
										<i :class="menu.icon"></i>
										<span>{{ menu.title }}</span>
									</template>
									<el-menu-item v-for="child in getChildrenMenus(menu.id)" :index="child.url" :key="child.id"
										@click="navigateTo(child.url)">
										<i :class="child.icon"></i>
										<span>{{ child.title }}</span>
									</el-menu-item>
								</el-sub-menu>
								<el-menu-item v-else :index="menu.url" :key="menu.id" @click="navigateTo(menu.url)">
									<i :class="menu.icon"></i>
									<span>{{ menu.title }}</span>
								</el-menu-item>
							</template>
						</el-menu>
					</el-scrollbar>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, } from 'element-plus'
import { Menu as IconMenu, Message, Setting, Plus, Platform, Right } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const router = useRouter(); // 获取路由实例

const imageUrl = ref('')

// 定义处理上传成功的函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
	response, // 上传成功后的响应数据
	uploadFile // 上传的文件对象
) => {
	// 使用 FileReader API 创建一个临时的 URL，以便可以在网页上查看图片
	imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
// 定义上传前的检查函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	// 检查文件类型是否为 JPEG 或 PNG 格式
	if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
		// 如果不是 JPEG 或 PNG 格式，则弹出错误消息
		ElMessage.error('Avatar picture must be JPG or PNG format!')
		// 并返回 false 阻止上传操作
		return false
	} else if (rawFile.size / 1024 / 1024 > 5) {
		// 检查文件大小是否不超过 2MB
		ElMessage.error('Avatar picture size can not exceed 5MB!')
		return false
	}
	// 如果文件格式和大小都符合要求，则返回 true 允许上传
	return true
}

// 清除登录信息的方法（暂未使用）
function clearLoginInfo() {
	// 如果使用 Vuex，可以调用一个 action 来清除用户状态
	// store.dispatch('auth/logout');
	// 如果使用 localStorage，可以清除存储的令牌
	localStorage.removeItem('token');
	// 清除其他可能存储的信息
	// localStorage.removeItem('userInfo');
}
const handleLogout = () => {
	clearLoginInfo();
	router.push({ name: 'Login' }); // 假设您的登录路由的名字是 'Login'
};

// 定义菜单数据
const defaultActive = ref('/');

const menus = ref([
	{ id: '1', title: '角色管理', icon: 'message', url: '/superadminhome/rolemangt', pid: '0', order: 1 },
	{ id: '2', title: '角色授权', icon: 'option1-icon', url: '/superadminhome/rolepurview', pid: '0', order: 2 },
	// ... 其他顶级菜单项
]);

//路由导航
const navigateTo = (url) => {
	router.push(url);
};
//过滤菜单是否为父菜单
const filteredMenus = computed(() => {
	return menus.value.filter(menu => menu.pid === '0');
});
//过滤节点是否有孩子节点
const hasChildren = (menu) => {
	return menus.value.some(child => child.pid === menu.id);
};
//获取节点的孩子节点
const getChildrenMenus = (parentId) => {
	return menus.value.filter(menu => menu.pid === parentId);
};
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

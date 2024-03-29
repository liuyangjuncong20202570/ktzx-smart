import { defineStore } from 'pinia'
import { ref ,computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {

    const profilename = ref(null) //username用户名
    const profilerolename = ref(null) //角色名
    const profilecatelog = ref(null) //登录方式
    const profilehomeurl = ref(null) //登录主页
    const profiletoken = ref(null) //token
    const currentterm = ref(null) //学期

    //存入初次登录后的信息
    function setProfileInfo(username, rolename, catelog, homeurl, token, term) {
        profilename.value = username;
        profilerolename.value = rolename
        profilecatelog.value = catelog
        profilehomeurl.value = homeurl
        profiletoken.value = token;
        currentterm.value = term;
    }

    function initProfileStore() {
        const storedUserInfo = sessionStorage.getItem('users');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            setProfileInfo(userInfo.username, userInfo.rolename, userInfo.catelog, userInfo.homeurl, userInfo.token, userInfo.currentterm);
        }
    }

    // 在store创建时初始化状态
    initProfileStore();


    return {
        profilename,
        profilerolename,
        profilecatelog,
        profilehomeurl,
        profiletoken,
        currentterm,
        setProfileInfo,
    }
})

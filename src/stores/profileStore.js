import { defineStore } from 'pinia'
import { ref ,computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
    const profileid = ref(null) // 用户id
    const profilename = ref(null) //username用户名
    const profileloginname = ref(null) //loginname用户名
    const profileroleid = ref(null) //角色id
    const profilerolename = ref(null) //角色名
    const profilecatelog = ref(null) //登录方式
    const profilehomeurl = ref(null) //登录主页




    function setProfileInfo(userid,username,loginname,roleid,rolename,catelog,homeurl) {
        profileid.value = userid // 正确的方式来设置 ref 的值
        profilename.value = username
        profileloginname.value = loginname
        profileroleid.value = roleid
        profilecatelog.value = catelog
        profilehomeurl.value = homeurl
        profilerolename.value = rolename
    }

    function initProfileStore() {
        const storedUserInfo = sessionStorage.getItem('users');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            setProfileInfo(userInfo.userid, userInfo.username,userInfo.loginname,userInfo.roleid, userInfo.rolename, userInfo.catelog, userInfo.homeurl);
        }
    }

    // 在store创建时初始化状态
    initProfileStore();


    return {
        profileid,
        profilename,
        profileloginname,
        profileroleid,
        profilerolename,
        profilecatelog,
        profilehomeurl,
        setProfileInfo
    }
})

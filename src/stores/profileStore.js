import { defineStore } from 'pinia'
import { ref ,computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
    const profileid = ref(null) // 用户id
    const profilename = ref(null) //用户名
    const profileroleid = ref(null) //角色id
    const profilerolename = ref(null) //角色名
    const profilecatelog = ref(null) //登录方式
    const profilehomeurl = ref(null) //登录主页



    function setProfileInfo(userid,roleid,rolename,catelog,homeurl) {
        profileid.value = userid // 正确的方式来设置 ref 的值
        profileroleid.value = roleid
        profilecatelog.value = catelog
        profilehomeurl.value = homeurl
        profilerolename.value = rolename
    }
    function setProfilename(username) {
        profilename.value = username
    }

    return {
        profileid,
        profilename,
        profileroleid,
        profilerolename,
        profilecatelog,
        profilehomeurl,
        setProfileInfo,
        setProfilename
    }
})

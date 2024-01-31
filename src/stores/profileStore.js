import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
    const profileid = ref('') // 使用 ref 创建一个响应式引用
    const profileroleid = ref('')
    const profilecatelog = ref('')
    function setProfileInfo(userid,roleid,catelog) {
        profileid.value = userid // 正确的方式来设置 ref 的值
        profileroleid.value = roleid
        profilecatelog.value = catelog
    }

    return {
        profileid,
        profileroleid,
        profilecatelog,
        setProfileInfo
    }
})

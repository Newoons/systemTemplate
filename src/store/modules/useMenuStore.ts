
// 菜单相关store
import { defineStore } from "pinia";
import { ref } from "vue";



export const useMenuStore = defineStore('menuStore', () => {
    // 路线id
    let gl1Zj = ref('')
    const setgl1Zj = (val:any)=>{
        gl1Zj.value = val
    }
    // 巡查id
    let gl1XcId = ref('')
    const setgl1XcId = (val:any)=>{
        gl1XcId.value = val
    }


    return {
        gl1Zj, gl1XcId,// 配置持久化
        setgl1Zj,
        setgl1XcId
    }
},
// {
// 	persist: true
// }
);
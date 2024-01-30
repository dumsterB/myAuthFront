<template>
  <div style="background: black">
    Hello i am a user
    <pre v-if="userInfo">{{ userInfo }}</pre>
  </div>
</template>
<script setup lang="ts">
import { onMounted,ref } from "vue";
import { authModule } from "../../plugins/authModule.ts";
import { tokenService } from "../../services/tokenService.ts";
import { ElMessage } from "element-plus";
import router from "../../../router";
const userInfo = ref({})
const getUserInfo = async () => {
  try {
    const token = tokenService.get()
    const res = await authModule.getMe({accessToken: token.accessToken})
    if(res.ok){
      userInfo.value = res
    }else{
      ElMessage.error({message:res.msg})
      router.push('/signIn')
    }
  } catch (error) {
    console.log(error)
  }
}
onMounted(async () => {
  await getUserInfo()
})
</script>
<style scoped>

</style>
<template>
  <div class="app">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="signIn" name="signIn">signIn</el-tab-pane>
      <el-tab-pane label="signUp" name="signUp">signUp</el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter()

const activeName = ref('signIn')

function handleClick(value) {
  router.push(value.paneName)
}
</script>
<style scoped>
</style>

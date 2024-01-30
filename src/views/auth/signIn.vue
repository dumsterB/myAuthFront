<template>
  <div>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        label-position="top"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="Email or Phone" prop="emailOrPhone">
        <el-input v-model="ruleForm.emailOrPhone"/>
      </el-form-item>
      <el-form-item label="Password" prop="pass">
        <el-input
            v-model="ruleForm.pass"
            :show-password="true"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item class="ml-2">
        <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Submit
        </el-button
        >
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { authModule } from "../../plugins/authModule.ts";
import { tokenService } from '../../services/tokenService.ts'
import { useRouter } from "vue-router";

const ruleFormRef = ref<FormInstance>();
const loading = ref(false)
const router = useRouter()

const ruleForm = reactive({
  pass: "",
  emailOrPhone: "",
});

const rules = reactive<FormRules<typeof ruleForm>>({
  emailOrPhone: [
    {required: true, message: "Please input email or Phone", trigger: "blur"},
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        password: ruleForm.pass,
        credential: ruleForm.emailOrPhone,
      }
      try {
        const res = await authModule.login(data)
        if(res.ok){
          tokenService.save(res)
          router.push('/user')
        }
      } catch (error) {
        console.log(error)
      }

    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped></style>

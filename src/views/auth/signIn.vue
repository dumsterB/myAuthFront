<template>
  <div>
    <el-form
        v-if="activeStep === 1"
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        label-position="top"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="User info" prop="userInfo">
        <el-input v-model="ruleForm.userInfo" />
      </el-form-item>
      <el-form-item label="Password" prop="pass">
        <el-input
            v-model="ruleForm.pass"
            :show-password="true"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Confirm" prop="checkPass">
        <el-input
            v-model="ruleForm.checkPass"
            :show-password="true"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item class="ml-2">
        <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Submit</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>
    <el-form
        v-if="activeStep === 2"
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        label-position="top"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="User info" prop="userInfo">
        <el-input v-model="ruleForm.userInfo" />
      </el-form-item>
      <el-form-item label="Password" prop="pass">
        <el-input
            v-model="ruleForm.pass"
            :show-password="true"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Confirm" prop="checkPass">
        <el-input
            v-model="ruleForm.checkPass"
            :show-password="true"
            type="password"
            autocomplete="off"
        />
      </el-form-item>
      <el-form-item class="ml-2">
        <el-button type="primary" @click="submitForm(ruleFormRef)"
        >Submit</el-button
        >
        <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import {authModule} from "../../plugins/authModule.ts";

const ruleFormRef = ref<FormInstance>();
const activeStep = ref(2)
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password"));
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("Please input the password again"));
  } else if (value !== ruleForm.pass) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  pass: "",
  checkPass: "",
  email: "",
  phone:'',
  userInfo:'',
});

const rules = reactive<FormRules<typeof ruleForm>>({
  email: [
    { required: true, message: "Please input email address", trigger: "blur" },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    { required: true, message: "Please input phone number", trigger: "blur" },
  ],
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const data = {
        password: ruleForm.pass,
        email: ruleForm.email,
        phone: ruleForm.phone,
        userInfo: ruleForm.userInfo
      }
      authModule.register(data);
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

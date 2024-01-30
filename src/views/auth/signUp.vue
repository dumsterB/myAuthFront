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
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email"/>
        <el-button type="primary" :loading="loadingEmail" @click="ConfirmCodeByEmail"
        >Confirm code
        </el-button
        >
      </el-form-item>
      <el-form-item label="Confirm Email" prop="email">
        <el-input v-model="ruleForm.emailConfirmCode"/>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="ruleForm.phone"/>
        <el-button type="primary" :loading="loadingPhone" @click="ConfirmCodeByPhone"
        >Confirm code
        </el-button
        >
      </el-form-item>

      <el-form-item label="Confirm Phone" prop="email">
        <el-input v-model="ruleForm.phoneConfirmCode"/>
      </el-form-item>
      <el-form-item label="User info" prop="userInfo">
        <el-input v-model="ruleForm.userInfo"/>
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
import { useRouter } from "vue-router";

const router = useRouter()

const ruleFormRef = ref<FormInstance>();
const loading = ref(false)
const loadingEmail = ref(false)
const loadingPhone = ref(false)
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
  phone: '',
  userInfo: '',
  emailConfirmCode: '',
  phoneConfirmCode: '',
});

const rules = reactive<FormRules<typeof ruleForm>>({
  email: [
    {required: true, message: "Please input email address", trigger: "blur"},
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {required: true, message: "Please input phone number", trigger: "blur"},
  ],
  pass: [{validator: validatePass, trigger: "blur"}],
  checkPass: [{validator: validatePass2, trigger: "blur"}],
});

const ConfirmCodeByEmail = async () => {
  loadingEmail.value = true
  await authModule.sendConfirmCode({email: ruleForm.email})
  setTimeout(() => {
    loadingEmail.value = false
  }, 1000)
}

const ConfirmCodeByPhone = async () => {
  loadingPhone.value = true
  await authModule.sendConfirmCode({phone: ruleForm.phone})
  setTimeout(() => {
    loadingPhone.value = false
  }, 1000)
}
const submitForm = (formEl: FormInstance | undefined) => {
  loading.value = true
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        password: ruleForm.pass,
        email: ruleForm.email,
        phone: ruleForm.phone,
        userInfo: ruleForm.userInfo,
        emailConfirmCode: ruleForm.emailConfirmCode,
        phoneConfirmCode: ruleForm.phoneConfirmCode
      }
      try {
        const res = await authModule.register(data)
      } catch (error) {
        console.log(error)
      }
      loading.value = false

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

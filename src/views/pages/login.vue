<template>
    <div class="login-bg">
        <div class="login-container">
            <div class="login-header">
                <img class="logo mr10" src="../../assets/img/logo.svg" alt="" />
                <div class="login-title">成绩管理系统</div>
            </div>
            <el-form :model="param" :rules="rules" ref="login" size="large">
                <el-form-item prop="userAccount">
                    <el-input v-model="param.userAccount" placeholder="用户名">
                        <template #prepend>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="userPassword">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.userPassword"
                        @keyup.enter="submitForm(login)"
                    >
                        <template #prepend>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="pwd-tips" style="margin-top: 20px">
                    <el-checkbox class="pwd-checkbox" v-model="checked" label="记住密码" />
                </div>
                <el-button class="login-btn" type="primary" size="large" @click="submitForm(login)">登录</el-button>
                <p class="login-text">
                    没有账号？<el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
                </p>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTabsStore } from '@/store/tabs';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import {loginService} from "@/api/admin";

interface LoginInfo {
  userAccount: string;
  userPassword: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
  userAccount: defParam ? defParam.userAccount : '',
  userPassword: defParam ? defParam.userPassword : '',
});

const rules: FormRules = {
  userAccount: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
        {
          min: 4,
          max: 12,
          message: '用户名必须是4-12位',
          trigger: 'blur',
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^\S+/, message: '密码不能为空字符且空字符不能开头', trigger: 'blur' }
    ],
};
const login = ref<FormInstance>();
const submitForm =  (formEl: FormInstance | undefined) => {
    if (!formEl) return;
     formEl.validate(async (valid: boolean) => {
      if (valid) {
        const userAccount = param.userAccount;
        const userPassword = param.userPassword;
        const res = await loginService({userAccount, userPassword});
        if (res.data.code === 200) {
          ElMessage.success('登录成功');
          // 将 token 存储在 localStorage
          localStorage.setItem('authToken', res.data.data.token);
          localStorage.setItem('login_name', param.userAccount);
          await router.push('/');
        } else {
          ElMessage.error(`${res.data.msg}`);
        }
        if (checked.value) {
          localStorage.setItem('login-param', JSON.stringify(param));
        } else {
          localStorage.removeItem('login-param');
        }
      } else {
        ElMessage.error('登录失败');
        return false;
      }
    });
};

const tabs = useTabsStore();
tabs.clearTabs();
</script>

<style scoped>
.login-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: url(../../assets/img/login-bg.jpg) center/cover no-repeat;
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
}

.logo {
    width: 35px;
}

.login-title {
    font-size: 22px;
    color: #333;
    font-weight: bold;
}

.login-container {
    width: 450px;
    border-radius: 5px;
    background: #fff;
    padding: 40px 50px 50px;
    box-sizing: border-box;
}

.pwd-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: -10px 0 10px;
    color: #787878;
}

.pwd-checkbox {
    height: auto;
}

.login-btn {
    display: block;
    width: 100%;
}

.login-tips {
    font-size: 12px;
    color: #999;
}

.login-text {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    color: #787878;
}
</style>

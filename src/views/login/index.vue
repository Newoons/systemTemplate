<template>
    <div class="login-container">
        <div class="login-header">
            <div class="logo">
                <img src="@/assets/images/header-logo.png" alt="惠融智投" />
                <a-divider type="vertical" />
                <span>智能资产管理系统</span>
            </div>
        </div>

        <div class="login-content">
            <div class="login-card">
                <div class="login-card-title">欢迎来到惠融智投</div>
                <a-form class="login-card-form" :model="formState" name="basic" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }"
                    autocomplete="off" hideRequiredMark @finish="onFinish" @finishFailed="onFinishFailed" ref="formRef">
                    <div class="login-form">
                        <div class="form-title">账号登录</div>
                        <a-form-item label="" name="username"
                            :rules="[{ required: true, message: '请输入账号!' }]">
                            <a-input 
                                v-model:value="formState.username" 
                                placeholder="请输入账号"
                            >
                            <template #prefix>
                                <user-outlined />
                            </template>
                        </a-input>
                        </a-form-item>
                        <a-form-item label="" name="password"
                            :rules="[{ required: true, message: '请输入密码!' }]">
                            <a-input-password 
                                v-model:value="formState.password" 
                                placeholder="请输入密码" 
                                
                            >
                            <template #prefix>
                                <lock-outlined />
                            </template></a-input-password>
                        </a-form-item>
                        <a-form-item v-if="loginError" class="login-error">
                            <a-alert type="error" :message="loginError" show-icon />
                        </a-form-item>
                    </div>

                </a-form>
                <div class="login-card-footer">
                    <div>
                        <a-button block type="primary" @click="handleLogin" :loading="loading"  class="login-button">下一步</a-button>
                    </div>
                    <p class="agreement-text">注册即表示同意并已阅读 <a href="javascript:void(0)">《产品服务协议》</a> <a href="javascript:void(0)">《用户协议》</a>
                        <a href="javascript:void(0)">《隐私政策》</a>
                    </p>
                    <div class="login-card-footer-extra">
                        <a-button type="link" size="small">注册账号</a-button>
                        <a-divider type="vertical" />
                        <a-button type="link" size="small">忘记密码</a-button>
                    </div>
                </div>
            </div>
        </div>

        <div class="login-footer">
            <p>Copyright © 2023惠融智投科技有限公司版权所有. 湘ICP备20250000219-4</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import type { FormInstance } from 'ant-design-vue';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref<boolean>(false);
const loginError = ref<string>('');

interface FormState {
    username: string;
    password: string;
}

const formState = reactive<FormState>({
    username: '',
    password: '',
});

// 模拟的正确账号密码
const CORRECT_USERNAME = 'admin';
const CORRECT_PASSWORD = '123456';

// 处理登录
const handleLogin = async () => {
    loginError.value = '';
    loading.value = true;
    
    try {
        // 验证表单
        await formRef.value?.validate();
        
        // 模拟登录验证
        setTimeout(() => {
            if (formState.username === CORRECT_USERNAME && formState.password === CORRECT_PASSWORD) {
                message.success('登录成功');
                router.push('/');
            } else {
                loginError.value = '账号或密码错误，请重试';
            }
            loading.value = false;
        }, 1000);
    } catch (error) {
        loading.value = false;
        console.log('表单验证失败:', error);
    }
};

const onFinish = (values: any) => {
    console.log('Success:', values);
    handleLogin();
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};
</script>

<style scoped lang="scss">
@use '@/styles/mixins.scss' as mixins;

.login-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f7fa;
    background-image: linear-gradient(to right, #f0f2f5, #e6f7ff);
    position: relative;
    overflow: hidden;
    background: url('@/assets/images/login-background.png') no-repeat;
    background-size: 100% 100%;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: url('@/assets/images/login-bg.png');
        background-size: cover;
        background-position: center;
        opacity: 0.1;
        z-index: 0;
    }
}

.login-header {
    padding: 20px 40px;
    position: relative;
    z-index: 1;

    .logo {
        display: flex;
        align-items: center;

        img {
            height: 32px;
            margin-right: 10px;
        }

        span {
            font-size: 16px;
            font-weight: 500;
            color: #333;
        }
    }
}

.login-content {
    flex: 1;
    display: flex;
    padding: 40px;
    position: relative;
    z-index: 1;

    .login-card {
        position: absolute;
        right: 16%;
        top: 80px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 20px;
        width: 360px;
        height: 420px;
        display: flex;
        flex-direction: column;

        .login-card-title {
            font-size: 22px;
            font-weight: 600;
            color: #333;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 10px;
        }

        .login-card-form {
            flex: 1;
        }

        .form-title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 20px;
        }

        .login-card-footer {
            height: 120px;
            .agreement-text {
                font-size: 12px;
                color: #999;
                margin: 15px 0;
                a {
                    color: #1890ff;
                }
            }
        }

        .login-card-footer-extra {
            @include mixins.flex;
            margin-top: 10px;

            .ant-btn-link {
                color: #1890ff;
                font-size: 14px;
            }
        }
    }
}

.login-error {
    margin-top: -10px;
    margin-bottom: 10px;
}


.login-footer {
    text-align: center;
    padding: 20px 0;
    color: #999;
    font-size: 12px;
    position: relative;
    z-index: 1;
}
</style>
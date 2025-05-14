<template>
    <a-layout class="layout-container">
        <a-layout-sider :style="siderStyle">
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <user-outlined />
          <span>nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header :style="headerStyle">
                <div>
                    <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                </div>
            </a-layout-header>
            <a-layout-content :style="contentStyle">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { CSSProperties } from 'vue';
import { UserOutlined, MenuUnfoldOutlined,MenuFoldOutlined } from '@ant-design/icons-vue';
const selectedKeys = ref<string[]>(['1']);
const collapsed = ref<boolean>(false);
const headerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
};

const contentStyle: CSSProperties = {
    textAlign: 'center',
    minHeight: 'calc(100vh - 64px)', // 减去header的高度
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#108ee9',
    overflow: 'auto', // 添加滚动条
};

const siderStyle: CSSProperties = {
    textAlign: 'center',
    lineHeight: '100%',
    color: '#fff',
    backgroundColor: '#3ba0e9',
    height: '100vh', // 设置为视口高度
};

const footerStyle: CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
};
</script>

<style scoped>
.layout-container {
    height: 100vh;
    /* 设置布局容器高度为视口高度 */
}

/* 确保 Ant Design 布局组件正确显示 */
:deep(.ant-layout) {
    height: 100%;
    overflow: hidden;
}
</style>
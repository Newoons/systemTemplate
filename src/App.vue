<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>

<template>
  <a-config-provider :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<style scoped lang="scss"></style>

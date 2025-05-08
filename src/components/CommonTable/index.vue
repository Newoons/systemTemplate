<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { http } from '@/https/index';
import type { TablePaginationConfig, TableColumnType } from 'ant-design-vue';

// 定义表格选项接口
interface TableOptions {
  // 请求URL
  url: string;
  // 表格列配置
  columns: TableColumnType[];
  // 查询参数
  queryParams?: Record<string, any>;
  // 每页条数
  pageSize?: number;
  // 行数据的唯一键
  rowKey?: string | ((record: any) => string);
  // 是否自动加载数据
  autoLoad?: boolean;
  // 响应数据处理函数
  responseHandler?: (res: any) => { data: any[]; total: number };
}

// 定义组件属性
const props = defineProps({
  // 表格配置选项
  options: {
    type: Object as () => TableOptions,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['dataLoaded', 'loadError']);

// 获取选项的默认值
const getOptionValue = <T>(key: keyof TableOptions, defaultValue: T): T => {
  return props.options[key] !== undefined ? props.options[key] as T : defaultValue;
};

// 表格数据
const tableData = ref<any[]>([]);
// 加载状态
const loading = ref(false);
// 表格容器引用
const tableContainer = ref<HTMLElement | null>(null);
// 表格高度
const tableHeight = ref<number>(400);

// 分页配置
const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: getOptionValue('pageSize', 10),
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `共 ${total} 条`
});

// 加载表格数据
const loadData = async () => {
  if (!props.options.url) return;
  
  loading.value = true;
  try {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...getOptionValue('queryParams', {})
    };

    const res = await http.get(props.options.url, params);
    const responseHandler = getOptionValue('responseHandler', (res: any) => ({
      data: res.data?.list || res.data || [],
      total: res.data?.total || 0
    }));
    
    const { data, total } = responseHandler(res);

    tableData.value = data;
    pagination.total = total;

    emit('dataLoaded', { data, total, response: res });
  } catch (error) {
    console.error('加载表格数据失败:', error);
    emit('loadError', error);
  } finally {
    loading.value = false;
  }
};

// 表格变化处理（分页、排序、筛选）
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1;
  pagination.pageSize = pag.pageSize || 10;
  loadData();
};

// 计算表格高度以撑满页面
const calculateTableHeight = () => {
  nextTick(() => {
    if (tableContainer.value) {
      const containerRect = tableContainer.value.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // 计算表格到窗口底部的距离，预留一些空间（如页脚等）
      const bottomOffset = 120;
      tableHeight.value = windowHeight - containerRect.top - bottomOffset;
    }
  });
};

// 监听查询参数变化
watch(
  () => props.options.queryParams,
  () => {
    pagination.current = 1; // 重置到第一页
    loadData();
  },
  { deep: true }
);

// 监听URL变化
watch(
  () => props.options.url,
  () => {
    if (props.options.url) {
      pagination.current = 1; // 重置到第一页
      loadData();
    }
  }
);

// 组件挂载后
onMounted(() => {
  calculateTableHeight();
  window.addEventListener('resize', calculateTableHeight);
  
  if (getOptionValue('autoLoad', true) && props.options.url) {
    loadData();
  }
});

// 暴露方法给父组件
const refresh = () => {
  loadData();
};

const reset = () => {
  pagination.current = 1;
  loadData();
};

// 暴露方法
defineExpose({
  refresh,
  reset
});
</script>

<template>
  <div class="common-table-container" ref="tableContainer">
    <a-table 
      :columns="options.columns" 
      :dataSource="tableData" 
      :loading="loading" 
      :pagination="pagination"
      :scroll="{ y: tableHeight }" 
      @change="handleTableChange" 
      :rowKey="getOptionValue('rowKey', 'id')"
    >
      <template #headerCell="{ column }">
        <slot :name="`header-${column.dataIndex}`" :column="column">
          {{ column.title }}
        </slot>
      </template>

      <!-- 自定义单元格 -->
      <template #bodyCell="{ text, record, index, column }">
        <slot name="bodyCell" :text="text" :record="record" :index="index" :column="column">
          {{ text }}
        </slot>
      </template>
    </a-table>
  </div>
</template>

<style scoped>

</style>
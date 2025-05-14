<template>
  <div class="page-container h100">
    <!-- 搜索区域 -->
    <div class="search-container">
      <!-- 查询表单 -->
      <CommonForm :options="formFields" :initialValues="initialValues" ref="formRef" @search="handleSearch"
        @reset="handleReset">
        <!-- 自定义按钮 -->
        <template #buttons>
          <a-button @click="getFormValues">获取表单值</a-button>
          <a-button @click="handleExport">导出</a-button>
        </template>

        <!-- 自定义字段 -->
        <template #field-custom="{ field, formState }">
          <a-radio-group v-model:value="formState[field.name]">
            <a-radio value="1">选项一</a-radio>
            <a-radio value="2">选项二</a-radio>
          </a-radio-group>
        </template>
      </CommonForm>
    </div>

    <CommonTable :options="tableOptions" @dataLoaded="handleDataLoaded">
      <!-- 自定义表头 -->
      <template #header-name="{ column }">
        <span style="color: blue">{{ column.title }}</span>
      </template>

      <!-- 自定义单元格 -->
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="handleEdit(record)">编辑</a-button>
          <a-button type="link" danger @click="handleDelete(record)">删除</a-button>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          <a-tag :color="text === 'active' ? 'green' : 'red'">
            {{ text === 'active' ? '活跃' : '禁用' }}
          </a-tag>
        </template>
      </template>
    </CommonTable>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import CommonTable from '@/components/CommonTable/index.vue';
import CommonForm from '@/components/CommonForm/index.vue';

// 表格配置选项
const tableOptions = reactive({
  url: '/api/users',
  columns: [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
    }
  ],
  // queryParams: {
  // },
  pageSize: 10,
  rowKey: 'id',
  autoLoad: true,
  // 自定义响应处理
  responseHandler: (res) => ({
    data: res.data.records || [],
    total: res.data.total || 0
  })
});
// 表单字段配置
const formFields = [
  {
    type: 'input',
    name: 'keyword',
    label: '关键词',
    placeholder: '请输入姓名或地址'
  },
  {
    type: 'select',
    name: 'status',
    label: '状态',
    options: [
      { label: '活跃', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ]
  },
  {
    type: 'dateRange',
    name: 'createTime',
    label: '创建时间'
  },
  {
    type: 'cascader',
    name: 'region',
    label: '地区',
    options: [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州',
            children: [
              {
                value: 'xihu',
                label: '西湖',
              },
            ],
          },
        ],
      }
    ]
  },
  {
    type: 'custom',
    name: 'custom',
    label: '自定义'
  }
];

// 初始值
const initialValues = {
  keyword: '',
  status: 'active'
};

// 查询参数
const queryParams = ref({});

const formRef = ref<any>(null);

const getFormValues = () => {
  if (formRef.value) {
    const values = formRef.value.getFormValues();
    console.log('表单值:', values);
    // 可以进行其他操作，如保存、提交等
  }
};

// 处理查询
const handleSearch = (values) => {
  console.log('查询参数:', values);
  queryParams.value = values;
};

// 处理重置
const handleReset = (values) => {
  console.log('重置表单:', values);
  queryParams.value = values;
};

// 处理导出
const handleExport = () => {
  console.log('导出数据');
};


// 数据加载完成回调
const handleDataLoaded = ({ data, total }) => {
  console.log('数据加载完成', data, total);
};

// 处理编辑操作
const handleEdit = (record) => {
  console.log('编辑', record);
};

// 处理删除操作
const handleDelete = (record) => {
  console.log('删除', record);
};
</script>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}
</style>
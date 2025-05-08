<template>
  <div class="common-form-container">
    <a-form layout="inline" :model="formState" @finish="handleFinish">
      <template v-for="(field, index) in options" :key="field.name">
        <a-form-item :label="field.label">
          <!-- 输入框 -->
          <a-input 
            v-if="field.type === 'input'" 
            v-model:value="formState[field.name]" 
            :placeholder="field.placeholder || `请输入${field.label}`"
            :allowClear="field.allowClear !== false"
          />
          
          <!-- 选择框 -->
          <a-select 
            v-else-if="field.type === 'select'" 
            v-model:value="formState[field.name]" 
            :placeholder="field.placeholder || `请选择${field.label}`"
            :allowClear="field.allowClear !== false"
            :options="field.options || []"
            :mode="field.mode"
            style="min-width: 120px;"
          />
          
          <!-- 日期选择器 -->
          <a-date-picker 
            v-else-if="field.type === 'date'" 
            v-model:value="formState[field.name]" 
            :placeholder="field.placeholder || `请选择${field.label}`"
            :allowClear="field.allowClear !== false"
            :format="field.format || 'YYYY-MM-DD'"
          />
          
          <!-- 日期范围选择器 -->
          <a-range-picker 
            v-else-if="field.type === 'dateRange'" 
            v-model:value="formState[field.name]" 
            :placeholder="field.placeholder || [`开始日期`, `结束日期`]"
            :allowClear="field.allowClear !== false"
            :format="field.format || 'YYYY-MM-DD'"
          />
          
          <!-- 级联选择器 -->
          <a-cascader 
            v-else-if="field.type === 'cascader'" 
            v-model:value="formState[field.name]" 
            :placeholder="field.placeholder || `请选择${field.label}`"
            :allowClear="field.allowClear !== false"
            :options="field.options || []"
            :changeOnSelect="field.changeOnSelect"
          />
          
          <!-- 数字输入框 -->
          <a-input-number 
            v-else-if="field.type === 'number'" 
            v-model:value="formState[field.name]" 
            :placeholder="field.placeholder || `请输入${field.label}`"
            :min="field.min"
            :max="field.max"
            :step="field.step || 1"
          />
          
          <!-- 自定义插槽 -->
          <slot v-else :name="`field-${field.name}`" :field="field" :formState="formState"></slot>
        </a-form-item>
      </template>
      
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
          <slot name="buttons"></slot>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';

// 组件属性
const props = defineProps({
  // 表单字段配置
  options: {
    type: Array as () => any[],
    required: true
  },
  // 初始值
  initialValues: {
    type: Object,
    default: () => ({})
  }
});

// 定义事件
const emit = defineEmits(['search', 'reset', 'valuesChange']);

// 表单状态
const formState = reactive<Record<string, any>>({});

// 初始化表单状态
const initFormState = () => {
  // 清空现有状态
  Object.keys(formState).forEach(key => {
    delete formState[key];
  });
  
  // 设置默认值
  props.options.forEach(field => {
    // 优先使用传入的初始值，其次使用字段默认值
    const initialValue = props.initialValues[field.name] !== undefined 
      ? props.initialValues[field.name] 
      : field.defaultValue;
    
    formState[field.name] = initialValue;
  });
};

// 提交表单
const handleFinish = () => {
  // 处理日期范围
  const processedValues = getFormValues();
  emit('search', processedValues);
};

// 重置表单
const handleReset = () => {
  initFormState();
  emit('reset', { ...formState });
};

// 获取表单值的方法
const getFormValues = () => {
  // 处理日期范围
  const processedValues = { ...formState };
  
  props.options.forEach(field => {
    if (field.type === 'dateRange' && Array.isArray(formState[field.name])) {
      // 将日期范围转换为开始和结束日期
      const [startDate, endDate] = formState[field.name];
      if (startDate && endDate) {
        processedValues[`${field.name}Start`] = startDate.format(field.format || 'YYYY-MM-DD');
        processedValues[`${field.name}End`] = endDate.format(field.format || 'YYYY-MM-DD');
      }
      delete processedValues[field.name];
    } else if (field.type === 'date' && formState[field.name]) {
      // 格式化单个日期
      processedValues[field.name] = formState[field.name].format(field.format || 'YYYY-MM-DD');
    }
  });
  
  return processedValues;
};

// 监听表单值变化
watch(formState, (newValues) => {
  emit('valuesChange', { ...newValues });
}, { deep: true });

// 组件挂载时初始化表单
onMounted(() => {
  initFormState();
});

// 暴露方法给父组件
defineExpose({
  getFormValues,
  reset: handleReset
});
</script>

<style scoped>
.common-form-container {
  margin-bottom: 16px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
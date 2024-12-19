<template>
  <a-card title="发布作业">
    <template #extra>
      <a-button type="primary" @click="handleSubmit">发布作业</a-button>
    </template>
    <a-flex justify="center">
      <a-form :model="formState" @submit.prevent="handleSubmit" style="width: 600px;"
    >
      <a-form-item label="作业名称" :rules="[{ required: true, message: '请输入作业名称' }]">
        <a-input v-model:value="formState.name" placeholder="请输入作业名称" />
      </a-form-item>
      <a-flex gap="30">
        <a-form-item label="作业满分" :rules="[{ required: true, message: '请输入满分成绩' }]">
          <a-input v-model:value="formState.fullScore" placeholder="请输入满分成绩" />
        </a-form-item>
        <a-form-item label="作业及格" :rules="[{ required: true, message: '请输入及格成绩' }]">
          <a-input v-model:value="formState.passScore" placeholder="请输入及格成绩" />
        </a-form-item>
      </a-flex>
      <a-form-item label="作业内容" :rules="[{ required: true, message: '请输入作业内容' }]">
        <a-textarea v-model:value="formState.content" placeholder="请输入作业内容" />
      </a-form-item>
      <a-form-item label="其他材料">
        <a-upload-dragger
          v-model:fileList="fileList"
          name="file"
          :multiple="true"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          @change="handleChange"
          @drop="handleDrop"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined />
          </p>
          <p class="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          <p class="ant-upload-hint">
            支持单个或批量上传。严格禁止上传公司数据或其他波段文件
          </p>
        </a-upload-dragger>
      </a-form-item>
      <a-form-item label="规定时间">
        <a-range-picker v-model:value="formState.timeRange" />
      </a-form-item>
      <a-form-item label="发布方式">
        <a-radio-group v-model:value="formState.publishType">
          <a-radio value="immediate">立即发布</a-radio>
          <a-radio value="scheduled">定时发布</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    </a-flex>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useHomeworkStore } from '~/store/homework';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { useHomeworkApi } from '~/composables/homework';

const { createHomework, updateHomework } = useHomeworkApi();
const homeworkStore = useHomeworkStore();

const formState = ref<{
  id: string;
  name: string;
  fullScore: string;
  passScore: string;
  content: string;
  timeRange: [string, string];
  publishType: string;
}>({
  id: '',
  name: '',
  fullScore: '',
  passScore: '',
  content: '',
  timeRange: ['', ''],
  publishType: 'immediate',
});

const fileList = ref([]);

const handleChange = (info: any) => {
  fileList.value = info.fileList;
};

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer) {
    console.log('Dropped files', e.dataTransfer.files);
  }
};

const resetForm = () => {
  formState.value = {
    id: '',
    name: '',
    fullScore: '',
    passScore: '',
    content: '',
    timeRange: ['', ''],
    publishType: 'immediate',
  };
  fileList.value = [];
};

const handleSubmit = async () => {
  try {
    const files = fileList.value.map((file: any) => file.url);
    const [timeRangeStart, timeRangeEnd] = formState.value.timeRange;
    const homeworkData = {
      id: formState.value.id,
      name: formState.value.name,
      full_score: formState.value.fullScore,
      pass_score: formState.value.passScore,
      content: formState.value.content,
      time_range_start: timeRangeStart,
      time_range_end: timeRangeEnd,
      publish_type: formState.value.publishType,
      files,
    };
    if (formState.value.id) {
      await updateHomework(homeworkData);
      message.success('作业更新成功');
    } else {
      await createHomework(homeworkData);
      message.success('作业发布成功');
    }
    resetForm(); // 清除表单
  } catch (error) {
    message.error('作业发布失败');
  }
};

onMounted(() => {
  const homework = homeworkStore.currentHomework;
  if (homework) {
    formState.value = {
      id: homework.id,
      name: homework.name,
      fullScore: homework.full_score.toString(),
      passScore: homework.pass_score.toString(),
      content: homework.content,
      timeRange: [homework.time_range_start, homework.time_range_end],
      publishType: homework.publish_type,
    };
    homeworkStore.clearCurrentHomework();
  }
});
</script>

<style scoped>
/* 确保没有拼写错误或不正确的 CSS 语法 */
</style>
<template>
  <a-card title="作业批改">
    <a-table :columns="columns" :dataSource="homeworkList" rowKey="id">
      <template #action="{ record }">
        <a-space size="middle">
          <a-button type="link" @click="handleCorrect(record)">批改</a-button>
        </a-space>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useHomeworkApi } from '~/composables/homework';
import type { ColumnsType } from 'ant-design-vue/es/table';

const { getHomeworkList } = useHomeworkApi();
const router = useRouter();

interface Homework {
  id: string;
  name: string;
  full_score: number;
  pass_score: number;
  content: string;
  time_range_start: string;
  time_range_end: string;
  publish_type: string;
  created_at: string;
  updated_at: string;
}

const homeworkList = ref<Homework[]>([]);

const columns: ColumnsType<Homework> = [
  {
    title: '作业名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '满分',
    dataIndex: 'full_score',
    key: 'full_score',
    align: 'center',
  },
  {
    title: '及格分',
    dataIndex: 'pass_score',
    key: 'pass_score',
    align: 'center',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
  },
  {
    title: '开始时间',
    dataIndex: 'time_range_start',
    key: 'time_range_start',
    align: 'center',
  },
  {
    title: '结束时间',
    dataIndex: 'time_range_end',
    key: 'time_range_end',
    align: 'center',
  },
  {
    title: '发布方式',
    dataIndex: 'publish_type',
    key: 'publish_type',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
    align: 'center',
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 150, // 设置操作栏的最小宽度
    slots: { customRender: 'action' },
  },
];

const fetchHomeworkList = async () => {
  try {
    const response = await getHomeworkList();
    if (response.data) {
      homeworkList.value = response.data as Homework[];
    } else {
      homeworkList.value = [];
    }
  } catch (error) {
    console.error('Error fetching homework list:', error);
  }
};

const handleCorrect = (record: Homework) => {
  router.push({ path: `/homework/correct/${record.id}` });
};

onMounted(() => {
  fetchHomeworkList();
});
</script>

<style scoped>
/* 确保没有拼写错误或不正确的 CSS 语法 */
</style>
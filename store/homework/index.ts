import { defineStore } from 'pinia';

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

export const useHomeworkStore = defineStore('homework', {
  state: () => ({
    currentHomework: null as Homework | null,
  }),
  actions: {
    setCurrentHomework(homework: Homework) {
      this.currentHomework = homework;
    },
    clearCurrentHomework() {
      this.currentHomework = null;
    },
  },
});
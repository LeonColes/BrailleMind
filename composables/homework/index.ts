export const useHomeworkApi = () => {
  const createHomework = async (homeworkData: any) => {
    try {
      const response = await $fetch('/api/homework/create', {
        method: 'POST',
        body: homeworkData,
      });
      return response;
    } catch (error) {
      console.error('Error creating homework:', error);
      throw error;
    }
  };

  const updateHomework = async (homeworkData: any) => {
    try {
      const response = await $fetch('/api/homework/update', {
        method: 'POST',
        body: homeworkData,
      });
      return response;
    } catch (error) {
      console.error('Error updating homework:', error);
      throw error;
    }
  };

  const correctHomework = async (correctionData: any) => {
    try {
      const response = await $fetch('/api/homework/correct', {
        method: 'POST',
        body: correctionData,
      });
      return response;
    } catch (error) {
      console.error('Error correcting homework:', error);
      throw error;
    }
  };

  const deleteHomework = async (homeworkId: string) => {
    try {
      const response = await $fetch('/api/homework/delete', {
        method: 'POST',
        body: { id: homeworkId },
      });
      return response;
    } catch (error) {
      console.error('Error deleting homework:', error);
      throw error;
    }
  };

  const getHomeworkList = async () => {
    try {
      const response = await $fetch('/api/homework/view', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error fetching homework list:', error);
      throw error;
    }
  };

  const getHomeworkDetail = async (homeworkId: string) => {
    try {
      const response = await $fetch(`/api/homework/detail?id=${homeworkId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error fetching homework detail:', error);
      throw error;
    }
  };

  return {
    createHomework,
    updateHomework,
    correctHomework,
    deleteHomework,
    getHomeworkList,
    getHomeworkDetail,
  };
};
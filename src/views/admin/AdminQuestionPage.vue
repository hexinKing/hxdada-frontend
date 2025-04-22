<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    layout="inline"
    @submit="doSearch"
  >
    <a-form-item field="appId" label="应用 id">
      <a-input
        v-model="formSearchParams.appId"
        placeholder="请输入应用 id"
        allow-clear
      />
    </a-form-item>
    <a-form-item field="userId" label="用户 id">
      <a-input
        v-model="formSearchParams.userId"
        placeholder="请输入用户 id"
        allow-clear
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" style="width: 100px">
        搜索
      </a-button>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns"
    :data="dataList"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }"
    @page-change="onPageChange"
  >
    <template #questionContent="{ record }">
      <div class="scrollable-questions">
        <div
          v-for="(question, index) in JSON.parse(record.questionContent)"
          :key="index"
          class="question-item"
        >
          <div class="question-title">{{ question.title }}</div>
          <div class="options-container">
            <div
              v-for="option in question.options"
              :key="option.key"
              class="option-item"
            >
              <span class="option-key">{{ option.key }}.</span>
              <span class="option-value">{{ option.value }}</span>
              <span class="option-result">(结果: {{ option.result }})</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button type="primary" @click="handleEdit(record)">修改</a-button>
        <a-button status="danger" @click="confirmDelete(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>

  <a-modal
    v-model:visible="isConfirmVisible"
    title="确认删除"
    @ok="doDelete(confirmRecord)"
    @cancel="isConfirmVisible = false"
  >
    <p>您确定要删除该记录吗？</p>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import router from "@/router";

const formSearchParams = ref<API.QuestionQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.QuestionQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.Question[]>([]);
const total = ref<number>(0);

const isConfirmVisible = ref(false);
const confirmRecord = ref<API.Question | null>(null);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listQuestionByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value,
  };
};

/**
 * 当分页变化时，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 确认删除
 * @param record
 */
const confirmDelete = (record: API.Question) => {
  confirmRecord.value = record;
  isConfirmVisible.value = true;
};

/**
 * 处理编辑操作
 * @param record 当前记录
 */
const handleEdit = (record: API.Question) => {
  window.location.href = `http://localhost:8080/add/question/${record.appId}`;
};

/**
 * 删除
 */
const doDelete = async (record: API.Question) => {
  if (!record || !record.id) {
    return;
  }

  const res = await deleteQuestionUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败，" + res.data.message);
  }
  isConfirmVisible.value = false;
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});

// 表格列配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "题目内容",
    dataIndex: "questionContent",
    slotName: "questionContent",
  },
  {
    title: "应用 id",
    dataIndex: "appId",
  },
  {
    title: "用户 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
.scrollable-questions {
  max-height: 300px; /* 大约能显示3小题的高度 */
  overflow-y: auto;
  padding-right: 8px; /* 为滚动条留出空间 */
}

.question-item {
  margin-bottom: 16px;
}

.question-title {
  margin-bottom: 8px;
  font-weight: bold;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.option-key {
  color: #165dff;
  font-weight: bold;
}

.option-result {
  color: #86909c;
  font-size: 0.85em;
}
</style>

<template>
  <div id="addAppPage" class="app-form-container">
    <h2
      style="
        margin-bottom: 16px;
        text-align: center;
        color: #1d2129;
        font-size: 24px;
      "
    >
      {{ id ? "编辑应用" : "创建应用" }}
    </h2>
    <p
      style="
        margin-bottom: 32px;
        text-align: center;
        color: #86909c;
        font-size: 14px;
      "
    >
      请填写应用的基本信息
    </p>

    <a-form
      :model="form"
      style="width: 100%; max-width: 480px; margin: 0 auto"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <a-form-item field="appName" label="应用名称">
        <a-input
          v-model="form.appName"
          placeholder="请输入应用名称"
          style="border-radius: 6px"
        />
      </a-form-item>

      <a-form-item field="appDesc" label="应用描述">
        <a-textarea
          v-model="form.appDesc"
          placeholder="请输入应用描述"
          :auto-size="{ minRows: 3 }"
          style="border-radius: 6px"
        />
      </a-form-item>

      <a-form-item field="appIcon" label="应用图标">
        <PictureUploader
          v-if="form"
          :value="form.appIcon"
          :onChange="(value) => (form.appIcon = value)"
          biz="app_icon"
        />
        <p style="font-size: 12px; color: #86909c; margin-top: 8px">
          建议尺寸：512×512像素，支持JPG/PNG格式
        </p>
      </a-form-item>

      <a-form-item field="appType" label="应用类型">
        <a-select
          v-model="form.appType"
          placeholder="请选择应用类型"
          style="width: 100%; border-radius: 6px"
        >
          <a-option
            v-for="(value, key) of APP_TYPE_MAP"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>

      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          v-model="form.scoringStrategy"
          placeholder="请选择评分策略"
          style="width: 100%; border-radius: 6px"
        >
          <a-option
            v-for="(value, key) of APP_SCORING_STRATEGY_MAP"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-space :size="16">
          <a-button @click="router.back()">取消</a-button>
          <a-button type="primary" html-type="submit" style="width: 120px">
            提交
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import { useRouter } from "vue-router";
import {
  addAppUsingPost,
  editAppUsingPost,
  getAppVoByIdUsingGet,
} from "@/api/appController";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";
import PictureUploader from "@/components/PictureUploader.vue";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

const router = useRouter();

const form = ref({
  appDesc: "",
  appIcon: "",
  appName: "",
  appType: 0,
  scoringStrategy: 0,
});

const oldApp = ref();

const loadData = async () => {
  if (!props.id) return;

  try {
    const res = await getAppVoByIdUsingGet({ id: props.id });
    if (res.data?.code === 0 && res.data.data) {
      oldApp.value = res.data.data;
      form.value = { ...res.data.data };
    } else {
      console.error("获取数据失败", res.data?.message);
    }
  } catch (error) {
    console.error("获取数据失败", error);
  }
};

watchEffect(() => {
  loadData();
});

const handleSubmit = async () => {
  try {
    let res;
    if (props.id) {
      res = await editAppUsingPost({
        id: props.id,
        ...form.value,
      });
    } else {
      res = await addAppUsingPost(form.value);
    }

    if (res.data?.code === 0) {
      console.log("操作成功");
      setTimeout(() => {
        router.push(`/app/detail/${props.id || res.data.data}`);
      }, 1500);
    } else {
      console.error("操作失败", res.data?.message);
    }
  } catch (error) {
    console.error("操作失败", error);
  }
};
</script>

<style scoped>
.app-form-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .app-form-container {
    padding: 24px 16px;
    border-radius: 0;
  }
}
</style>

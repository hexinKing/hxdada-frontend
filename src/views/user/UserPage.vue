<template>
  <div style="padding: 20px; background-color: #f9f9f9">
    <a-card
      title="用户个人信息"
      style="
        width: 400px;
        margin: auto;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <a-form :model="userForm" layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model="userForm.userName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="用户头像">
          <div style="display: flex; align-items: center">
            <PictureUploader
              :value="userForm.userAvatar"
              :onChange="(value) => (userForm.userAvatar = value)"
              biz="user_avatar"
              style="flex-grow: 1"
            />
          </div>
        </a-form-item>
        <a-form-item label="用户简介">
          <a-input
            v-model="userForm.userProfile"
            placeholder="请输入用户简介"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="saveUserProfile"
            style="
              width: 100%;
              background-color: #1da57a;
              border-color: #1da57a;
            "
          >
            保存
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getLoginUserUsingGet,
  updateMyUserUsingPost,
} from "@/api/userController"; // 引入用户数据相关的 API
import message from "@arco-design/web-vue/es/message";
import PictureUploader from "@/components/PictureUploader.vue";

const userForm = ref<API.UserVO>({
  userName: "",
  userAvatar: "",
  userProfile: "",
});

// 加载用户信息函数
const loadUserData = async () => {
  const res = await getLoginUserUsingGet(); // 假设有一个 API 来获取当前用户的信息
  if (res.data.code === 0) {
    userForm.value = res.data.data; // 将获取到的用户信息赋值到表单
  } else {
    message.error("获取用户信息失败，" + res.data.message);
  }
};

// 保存用户信息函数
const saveUserProfile = async () => {
  const res = await updateMyUserUsingPost(userForm.value); // 调用更新用户信息的 API
  if (res.data.code === 0) {
    message.success("用户信息更新成功");
  } else {
    message.error("更新失败，" + res.data.message);
  }
};

// 组件加载时获取用户信息
onMounted(loadUserData);
</script>

<style scoped>
/* 自定义样式 */
.a-card {
  background-color: #ffffff;
}
</style>

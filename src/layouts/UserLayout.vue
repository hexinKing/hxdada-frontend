<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <div class="header-content">
          <a-space align="center" :size="16">
            <img class="logo" src="../assets/logo.png" />
            <div class="title">智能答题应用平台</div>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="content-card">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer class="footer"></a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#userLayout {
  position: relative;
  height: 100vh;
  text-align: center;
  background: linear-gradient(
      rgba(255, 255, 255, 0.35),
      rgba(255, 255, 255, 0.35)
    ),
    url("../assets/登录注册页面 .jfif") no-repeat center center;
  background-size: cover;
}

#userLayout .header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  height: 80px;
  padding: 0;
  line-height: 80px;
  background: transparent;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

#userLayout .logo {
  width: 48px;
  height: 48px;
  transition: transform 0.3s ease;
}

#userLayout .logo:hover {
  transform: scale(1.1);
}

#userLayout .title {
  color: #1890ff;
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#userLayout .content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  margin-top: 80px;
  padding: 24px;
}

.content-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .content-card {
    margin: 0 16px;
    padding: 24px;
  }

  #userLayout .title {
    font-size: 20px;
  }
}
.footer {
  padding: 20px;
  text-align: center;
  background: #efefef;
}
</style>

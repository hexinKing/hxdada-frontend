### 项目介绍
基于Vue3 + Arco Design + Pinia + Axios + OpenAPI等技术实现的AI 智能答题应用平台。
用户可以基于 AI 快速制作并发布答题应用，支持检索、分享、在线答题并基于 AI 得到回答总结；管理员可以集中管理和审核应用。

### 技术选型
- Web 网页开发
- Vue 3
- Vue-CLI 脚手架
- Axios 请求库
- Arco Design 组件库
- 前端工程化：ESLint + Prettier + TypeScript
- 富文本编辑器
- QRCode.js 二维码生成
- ⭐️ Pinia 状态管理
- ⭐️ OpenAPI 前端代码生成

## 项目安装和部署
### 1、安装项目依赖
```bash
npm install
# 
yarn 
```

### 获取后端代码接口
```
openapi --input http://localhost:8121/api//v2/api-docs --output ./backapi --client axios
```

### 2、项目构建
```bash
yarn build
```

### 3、生产环境运行
```
yarn serve
```

### 修复文件
```
yarn lint
```
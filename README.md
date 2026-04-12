# Feedback Buffer

一个极简的手机网页应用，用来在打开小红书之前先给自己 23 秒缓冲。

## 本地启动

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 生产构建

```bash
npm run build
npm run start
```

## 功能

- 首页只保留一句提醒和一个主按钮
- 点击后进入 23 秒倒计时
- 倒计时结束后给出两个选择
- 今日点击次数保存在浏览器本地 `localStorage`
- 包含 `manifest` 和 `service worker`，支持基础 PWA 安装

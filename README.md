# Feedback Buffer

一个极简的手机网页应用，用来在打开小红书之前先给自己 23 秒缓冲。

## 本地开发

```bash
nvm use
npm ci
npm run dev
```

打开终端里输出的本地地址，默认通常是 [http://localhost:3000](http://localhost:3000)。

推荐使用 Node.js `20.x`，与当前 Vercel 部署目标保持一致。

## 生产构建

```bash
npm run build
npm run start
```

## 部署说明

- 项目当前使用 Pages Router，适合直接导入 Vercel 部署
- `package.json` 中的 `engines.node` 已约束为 `20.x`，用于减少本地与 Vercel 的运行时偏差
- 仓库提交时不应包含 `node_modules`、`.next`、`.vercel` 等本地产物
- 使用仓库内的 `package-lock.json`，本地建议优先用 `npm ci` 做从零安装验证

## 功能

- 首页只保留一句提醒和一个主按钮
- 点击后进入 23 秒倒计时
- 倒计时结束后给出两个选择
- 今日点击次数保存在浏览器本地 `localStorage`
- 包含 `manifest` 和 `service worker`，支持基础 PWA 安装

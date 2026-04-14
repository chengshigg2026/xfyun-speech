# 海底世界朗读评测 - 云端版

## 一键部署到 Vercel

### 方法一：通过 GitHub（推荐）

1. 将 `vercel-api` 文件夹上传到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com) 并登录
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 点击 "Deploy"
6. 部署完成后，你会得到一个地址，如：`https://xfyun-speech-api.vercel.app`

### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 进入目录
cd vercel-api

# 部署
vercel
```

---

## 部署后配置

部署完成后，修改 `index.html` 中的 API 地址：

```javascript
// 将这行
let CLOUD_API = 'https://xfyun-speech-api.vercel.app';

// 改为你的实际地址
let CLOUD_API = 'https://你的项目名.vercel.app';
```

---

## 文件结构

```
vercel-api/
├── api/
│   └── evaluate.js    # 云端API
├── index.html         # 游戏页面
├── package.json
├── vercel.json
└── README.md
```

---

## 使用方法

部署完成后，直接访问你的 Vercel 地址即可使用，无需任何本地服务器。

---

## 功能

- ✅ 科大讯飞语音评测
- ✅ 平板/手机/电脑通用
- ✅ 无需本地服务器
- ✅ 成绩提交到 QuickForm

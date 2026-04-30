# 溯光集 — 历史博客

基于 Astro 构建的杂志编辑风个人历史博客，部署于 GitHub Pages。

---

## 项目结构

```
history-blog/
├── src/
│   ├── components/           # UI 组件
│   │   ├── Header.astro      # 顶部导航栏（Logo + 导航链接 + 主题切换）
│   │   ├── Footer.astro      # 页脚（站点信息 + 链接）
│   │   ├── PostCard.astro    # 文章卡片（首页/标签页的文章预览卡片）
│   │   ├── TagCloud.astro    # 标签云（按文章数量调整字号）
│   │   ├── ThemeToggle.astro # 主题切换按钮（浅色/羊皮纸/深色三态循环）
│   │   └── ReadingProgress.astro  # 顶部阅读进度条
│   ├── layouts/
│   │   ├── BaseLayout.astro  # 基础布局（所有页面共用：HTML 骨架、SEO、主题初始化）
│   │   └── PostLayout.astro  # 文章页布局（标题区、头图、元信息、首字下沉、标签、上下篇）
│   ├── pages/                # 路由页面（Astro 文件路径即 URL 路径）
│   │   ├── index.astro       # 首页：精选文章 + 最新文章 + 专题系列 + 标签云
│   │   ├── posts/[...slug].astro  # 文章详情页（动态路由，根据 slug 渲染对应文章）
│   │   ├── tags/index.astro  # 标签总览页：全部标签云 + 全部文章列表
│   │   ├── tags/[tag].astro  # 单标签页（动态路由，如 /tags/明朝）
│   │   ├── series.astro      # 专题系列页：按 series 字段聚合的文章组
│   │   └── 404.astro         # 404 页面
│   ├── content/posts/        # Markdown 文章存放目录
│   ├── styles/global.css     # 全局样式 + 三套主题 CSS 变量定义
│   ├── utils/date.ts         # 日期格式化工具
│   └── consts.ts             # 站点常量（标题、描述、作者、URL）
├── src/content.config.ts     # Astro 内容集合配置（Astro 6 新格式，含 loader）
├── astro.config.mjs          # Astro 配置（site、base、output、markdown 等）
└── package.json
```

---

## 已实现功能

| 功能 | 说明 |
|-----|------|
| **三种阅读模式** | 浅色 / 羊皮纸（sepia）/ 深色，切换后自动保存到 localStorage |
| **阅读进度条** | 页面顶部细线，随滚动实时显示阅读进度 |
| **首字下沉** | 文章正文首字 3.2em 大字号下沉，营造杂志感 |
| **标签系统** | 自由打标签，自动生成标签云和单标签聚合页 |
| **专题系列** | 给多篇文章添加相同 `series` 字段，自动在专题页聚合展示 |
| **精选文章** | `featured: true` 的文章在首页顶部以大卡片展示 |
| **响应式布局** | 桌面三栏 → 平板两栏 → 手机单栏自适应 |
| **思源宋体** | 标题使用 Noto Serif SC，正文使用系统无衬线字体栈 |
| **阅读时间估算** | 文章页自动计算并显示预计阅读时长 |
| **404 页面** | 自定义 404 页面，风格与站点统一 |

---

## 文章 Frontmatter 规范

在 `src/content/posts/` 目录下新建 `.md` 文件，顶部使用如下 frontmatter：

```yaml
---
title: "文章标题"                # 必填，字符串
description: "文章摘要"          # 必填，字符串，用于卡片和 SEO
pubDate: 2024-05-20            # 必填，发布日期（ISO 格式）
heroImage: "https://..."       # 可选，头图 URL。不填则卡片无图
updatedDate: 2024-05-25        # 可选，更新日期
tags: ["明朝", "政治", "书评"]  # 可选，字符串数组，自由标签
series: "专题名称"              # 可选，相同 series 的文章自动聚合成专题
seriesOrder: 1                 # 可选，专题内文章排序（数字越小越靠前）
featured: false                # 可选，true = 首页精选大卡片展示
draft: false                   # 可选，true = 构建时排除，不发布
---
```

### Frontmatter 字段速查表

| 字段 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `title` | `string` | 是 | 文章标题 |
| `description` | `string` | 是 | 文章摘要/副标题 |
| `pubDate` | `Date` | 是 | 发布日期 |
| `updatedDate` | `Date` | 否 | 更新日期，显示在发布日期旁 |
| `heroImage` | `string` | 否 | 头图 URL。建议宽度 1200px 以上 |
| `tags` | `string[]` | 否 | 标签数组，自动生成标签页 |
| `series` | `string` | 否 | 专题名称，相同值的文章自动聚合 |
| `seriesOrder` | `number` | 否 | 专题内排序优先级 |
| `featured` | `boolean` | 否 | 是否首页精选，默认 `false` |
| `draft` | `boolean` | 否 | 是否草稿，默认 `false` |

---

## 常用命令

```bash
npm run dev        # 启动本地开发服务器（默认 http://localhost:4321）
npm run build      # 构建生产版本（输出到 dist/）
npm run preview    # 预览构建结果
```

---

## 部署配置

### 修改站点信息

编辑以下文件中的个人信息：

- `src/consts.ts` — 站点标题、描述、作者名
- `astro.config.mjs` — `site` 改为你的 GitHub Pages 域名，`base` 改为仓库名（如仓库名就是 `history-blog` 则无需修改）

### GitHub Actions 自动部署

1. 在仓库根目录创建 `.github/workflows/deploy.yml`（见下方工作流文件）
2. 推送代码到 GitHub
3. 进入仓库 **Settings → Pages → Build and deployment**，Source 选择 **GitHub Actions**
4. 每次推送到 `main` 分支会自动构建并部署

<details>
<summary>点击展开 deploy.yml 工作流文件</summary>

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

</details>

---

## 可进一步定制的功能

以下功能已预留扩展空间，可根据需要逐步添加：

### 1. 搜索功能
- **状态**：已安装 `fuse.js`，尚未接入页面
- **建议**：在 `tags/index.astro` 或新增 `/search` 页面加入前端搜索框，对文章标题/描述/标签进行模糊匹配
- **参考**：Fuse.js 官方文档 + Astro 客户端脚本

### 2. 评论系统
- **状态**：未接入
- **建议**：使用 [Giscus](https://giscus.app/)，基于 GitHub Discussions，免费且与开发者/历史读者群体契合
- **接入方式**：在 `PostLayout.astro` 底部嵌入 Giscus 提供的 `<script>` 标签

### 3. RSS 订阅
- **状态**：未接入
- **建议**：安装 `@astrojs/rss`，在 `src/pages/rss.xml.js` 中生成 RSS feed
- **接入方式**：官方集成，约 10 行代码

### 4. 文章内图片灯箱
- **状态**：未接入
- **建议**：使用纯 CSS 或轻量 JS 库（如 `medium-zoom`），点击文章内图片放大查看
- **接入方式**：在 `PostLayout.astro` 中引入客户端脚本

### 5. 脚注/引用悬浮卡片
- **状态**：未接入
- **建议**：对历史文章中的人名、地名、古籍引用添加悬浮提示卡片
- **接入方式**：定义一个 Astro 组件，hover 时显示 tooltip

### 6. 目录导航（TOC）
- **状态**：未接入
- **建议**：长文章右侧显示浮动目录，点击跳转到对应章节
- **接入方式**：在 `PostLayout.astro` 中读取文章 headings 生成锚点导航

### 7. 字体定制
- **状态**：已使用思源宋体，可在 `global.css` 中替换
- **建议**：如需更强书卷气，可尝试 `LXGW WenKai`（霞鹜文楷）或 `ZCOOL XiaoWei`

### 8. 数据统计
- **状态**：未接入
- **建议**：使用 Google Analytics 或 Umami（自托管、隐私友好）统计访问量

---

## 技术栈

- **框架**：Astro 6
- **语言**：TypeScript
- **样式**：纯 CSS（CSS 变量实现主题切换，无 Tailwind）
- **字体**：Noto Serif SC（思源宋体，npm 包引入）
- **搜索库**：Fuse.js（已安装，待接入）
- **部署**：GitHub Pages + GitHub Actions

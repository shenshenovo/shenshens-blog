---
title: 如何从零开始搭建自己的博客（basic）
date: 2025-10-24
lastMod: 2024-05-18T07:29:49.820Z
tags: [blog]
category: 博客
summary: 基于astro和netlify搭建个人博客
---

**注意：**

1. 以下步骤不包含我所做的个性化修改（如 Life 板块搭建、组件添加、样式调整等）。如有需要，请移步**如何从零开始搭建自己的博客（advanced）** 。

2. 不同的主题在一些安装步骤或许有略微的差异，比如npm和pnpm的选择。本篇以Gyoza主题为例。

3. 选择astro的理由：我想用现代UI组件库来装点我的博客，比如Aceternity UI
   和Magic UI，astro很好地满足了这个要求。

---

### 阶段 0: 准备开发环境

1.  **安装 Node.js:**
    - 前往 [nodejs.org](https://nodejs.org/) 下载并安装 LTS (长期支持) 版本。npm 会自动随之安装。
2.  **安装 Git:**
    - 前往 [git-scm.com/downloads](https://git-scm.com/downloads) 下载并安装 Git。
3.  **验证安装:**
    - 打开你的命令行工具（推荐在 VS Code 中使用 `Terminal -> New Terminal`）。
    - 运行以下命令，确保能看到版本号：
      ```bash
      node -v
      npm -v
      git --version
      ```
    - _(如果遇到 `npm.ps1` 权限错误，请在 VS Code 终端下拉菜单中切换到 `Command Prompt (cmd)` 并设为默认)_
4.  **安装 pnpm:**
    - Gyoza 主题需要 `pnpm`。运行以下命令全局安装：
      ```bash
      npm install -g pnpm
      ```
5.  **配置 Git 用户信息:**
    - Git 需要知道你的身份才能进行“存档”（commit）。运行以下命令（替换为你自己的 GitHub 邮箱和用户名）：
      ```bash
      git config --global user.email "你的GitHub邮箱@example.com"
      git config --global user.name "你的GitHub用户名"
      ```
6.  **（可能需要）配置 Git 使用 HTTPS:**
    - 如果后续 `pnpm install` 因 SSH 权限失败，运行此命令强制 Git 使用 HTTPS：
      ```bash
      git config --global url."https://github.com/".insteadOf "git@github.com:"
      ```

---

### 阶段 1: 创建 Astro 项目

去astro官网找一个**自己喜欢的模板**，如果想要方便添加组件的，可以筛选时勾选**React和Tailwind CSS**。选择完成后，开始：

1.  **打开 CMD 终端**，`cd` 进入你想要创建项目的目录（例如 `cd Documents`）。
2.  **运行 Astro 创建命令 (你想要的模板为准，这里的示例是我选择的Gyoza主题):**
    ```bash
    npm create astro@latest -- --template lxchapu/astro-gyoza
    ```
3.  **回答脚手架问题:**
    - `Where should we create...?` -\> 输入项目名称 (例如 `my-gyoza-blog`)
    - `Install dependencies?` -\> Yes
    - `Use TypeScript?` -\> Yes (选择 `Strict`)
    - `Initialize git repository?` -\> Yes
4.  **进入项目目录:**
    ```bash
    cd my-gyoza-blog
    ```

---

### 阶段 2: 安装依赖并添加 React

1.  **使用 pnpm 安装项目依赖:**
    - (Astro 脚手架可能因超时未能完成安装，或者 Gyoza 主题本身就需要用 pnpm 安装)
    <!-- end list -->
    ```bash
    pnpm install
    ```
2.  **添加 React 集成:**
    - (Gyoza 主题可能需要，也是很多现代组件库的基础)
    <!-- end list -->
    ```bash
    pnpm dlx astro add react
    ```

    - 对所有提示问题回答 `y` (Yes)。

---

### 阶段 3: 本地运行和预览

1.  **启动开发服务器:**
    ```bash
    pnpm dev
    ```
2.  **在浏览器中打开:** `http://localhost:4321/`，你应该能看到你的 Gyoza 博客了。
3.  可以src/config.json中更改自己的头像，logo，格言等。可以对content中按照格式添加posts等。
4.  预览完毕后，在终端按 `Ctrl + C` 停止服务器。

---

### 阶段 4: 准备部署 (Git & GitHub)

1.  **在 GitHub 上创建仓库:**
    - 登录 [GitHub.com](https://github.com/)，点击 `+` -\> "New repository"。
    - 输入仓库名 (例如 `my-gyoza-blog`)，保持 Public，**不要**勾选初始化选项。
    - 创建仓库。
2.  **连接本地仓库到 GitHub:**
    - 复制 GitHub 仓库页面上提供的 `git remote add origin ...` 命令，粘贴到你的 CMD 终端并运行：
      ```bash
      git remote add origin https://github.com/你的GitHub用户名/my-gyoza-blog.git
      ```
3.  **打包、存档并推送你的代码:**
    - 在 CMD 终端按顺序运行以下命令：
      ```bash
      git add .
      ```
      ```bash
      git commit -m "feat: initial commit, blog is ready"
      ```

      - _(注意：Commit message 必须符合 Gyoza 主题的 `commitlint` 规则，例如以 `feat:` 或 `fix:` 等小写类型开头)_
      <!-- end list -->
      ```bash
      git push -u origin main
      ```
    - _(如果提示登录 GitHub，请完成登录)_

---

### 阶段 5: 部署到 Netlify

1.  **注册 Netlify:**
    - 前往 [Netlify.com](https://www.netlify.com/)，选择 "Sign up with GitHub"。
    - 授权 Netlify 访问你的 GitHub 仓库。
2.  **导入项目:**
    - 在 Netlify 仪表盘，点击 "Add new site" -\> "Import an existing project"。
    - 选择 "GitHub"，然后找到并选择你刚刚推送的 `my-gyoza-blog` 仓库。
3.  **配置部署设置:**
    - **Branch to deploy:** `main` (通常是默认)
    - **Build command:** **`pnpm build`**
    - **Publish directory:** **`dist/`** (通常是默认)
    - _(Netlify 应该能自动检测到 `pnpm` 并使用 `pnpm install` 作为安装命令，无需手动设置)_
4.  **部署:**
    - 点击 "Deploy site"。
    - 等待 1-2 分钟，Netlify 会自动构建并发布你的网站。

---

### 阶段 6: (可选) 绑定自定义域名 (例如 `shenshenovo.cn`)

1.  **在 Netlify 添加域名:**
    - 进入你部署好的 Netlify 站点。
    - 找到 "Domain management" -\> "Custom domains"。
    - 点击 "Add a domain"，输入 `shenshenovo.cn` 并确认。
2.  **获取 Netlify Name Servers:**
    - Netlify 会指示你使用 Netlify DNS，并提供 4 个 Name Server 地址（例如 `dns1.p06.nsone.net` 等）。
3.  **修改域名注册商的 DNS 设置:**
    - 登录你购买 `shenshenovo.cn` 的网站（如阿里云）。
    - 找到该域名的 **"修改 DNS 服务器"** 或 "Name Server 设置"。
    - **删除**原有的 Name Server 地址。
    - **添加** Netlify 提供的那 **4 个** Name Server 地址。
    - 保存更改。
4.  **等待:**
    - 等待 DNS 全球生效（几分钟到几小时）。
    - Netlify 会自动完成验证并配置 HTTPS。

之后，你的博客就可以通过 `https://shenshenovo.cn` 访问了。未来的更新只需在本地修改代码，然后 `git add .`, `git commit -m "..."`, `git push origin main` 即可自动触发 Netlify 部署。

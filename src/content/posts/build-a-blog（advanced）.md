---
title: 如何从零开始搭建自己的博客（advanced）
date: 2025-10-24
lastMod: 2025-12-02
tags: [blog]
category: 博客
summary: 基于原有框架对博客进行的一些更改
---

搭建完之后，我发现Gyoza 主题自带的 "Projects"（项目）板块默认是跳转到外部链接的卡片，这不符合我想写“生活随笔”的需求。于是我进行了如下修改。

## 第一部分：将 Projects 改造为 Life 板块

我们的目标是：保留原有的漂亮卡片布局，但让它读取 Markdown 文章，并且点击卡片后跳转到文章详情页。

### 1. 定义新的内容集合 (Content Collection)

首先，我们要告诉 Astro 我们有一个新的“数据库”叫 `life`。

修改 `src/content/config.ts`：

```typescript
import { z, defineCollection } from 'astro:content'

// ... 保持 postsCollection 等不变

// 1. 删除原有的 projectsCollection (如果不再需要)
// 2. 新增 lifeCollection，类型设为 'content' (读取 Markdown)
const lifeCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    heroImage: z.string(), // 用于卡片封面
  }),
})

export const collections = {
  posts: postsCollection,
  // projects: projectsCollection, // 删除或注释
  life: lifeCollection, // 注册新集合
  // ... 其他集合
}
```

### 2\. 准备内容文件

创建文件夹 `src/content/life/`，并在里面放入你的 `.md` 文章。

示例 `src/content/life/my-trip.md`：

```markdown
---
title: '我的生活随笔'
description: '这是显示在卡片上的简短描述...'
date: 2025-10-24
heroImage: '/my-photo.jpg'
---

这里是正文内容...
```

### 3\. 修改导航菜单

打开“中央控制面板” `src/config.json`，修改菜单链接：

```json
"menus": [
  // ...
  {
    "name": "Life",
    "link": "/life",
    "icon": "icon-ghost"
  },
  // ...
]
```

### 4\. 改造卡片列表组件

我们需要修改负责渲染卡片的组件，让它获取 `life` 数据，并链接到内部路径。

修改 `src/components/ProjectList.astro`：

```astro
---
import { getCollection } from 'astro:content'

// 获取 'life' 集合并按日期排序
const lifePosts = (await getCollection('life')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
)
---

<ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
  {
    lifePosts.map((post) => (
      <li>
        {/* 修改 href 指向内部路径 */}
        <a href={`/life/${post.slug}/`}>
          <div class="rounded-lg bg-accent/10 overflow-hidden group">
            <div class="aspect-video overflow-hidden">
              <img
                class="size-full object-cover transition-transform group-hover:scale-110"
                src={post.data.heroImage}
                alt={`Cover for: ${post.data.title}`}
                loading="lazy"
              />
            </div>
            <div class="p-4">
              <div class="group-hover:text-accent">
                <span class="text-xl font-bold">{post.data.title}</span>
              </div>
              <p class="mt-2 text-sm line-clamp-2">{post.data.description}</p>
            </div>
          </div>
        </a>
      </li>
    ))
  }
</ul>
```

### 5\. 重建页面路由 (关键步骤)

Gyoza 主题原本使用动态路由处理页面，为了更清晰地管理 `life` 板块，我建立了标准的 Astro 目录结构。

在 `src/pages/` 下新建 `life` 文件夹，并创建两个文件：

**文件 A：列表页 (`src/pages/life/index.astro`)**

```astro
---
import PageLayout from '@/layouts/PageLayout.astro'
import Highlight from '@/components/Highlight.astro'
import ProjectList from '@/components/ProjectList.astro'
---

<PageLayout title="Life">
  <div class="max-w-[800px] mx-auto px-4 py-16 space-y-8">
    <header class="space-y-4">
      <h1 class="text-4xl font-bold">
        <Highlight>Life</Highlight>
      </h1>
      <p>这里是我的生活点滴、爱好和随想。</p>
    </header>
    <ProjectList />
  </div>
</PageLayout>
```

**文件 B：详情页 (`src/pages/life/[...slug].astro`)**

这个模板基于 `MarkdownLayout`，剔除了博客特有的标签、分类等功能，保持纯净。

```astro
---
import { getCollection } from 'astro:content'
import MarkdownLayout from '@/layouts/MarkdownLayout.astro'
import Highlight from '@/components/Highlight.astro'
import MarkdownWrapper from '@/components/MarkdownWrapper.astro'

export const getStaticPaths = async () => {
  const lifeList = await getCollection('life')
  return lifeList.map((md) => ({
    params: { slug: md.slug },
    props: { md },
  }))
}

const { md } = Astro.props
const { Content } = await md.render()
---

<MarkdownLayout
  title={md.data.title}
  description={md.data.description}
  mdTitle={md.data.title}
  mdDescription={md.data.description}
  mdSlug={`/life/${md.slug}`}
>
  <div class="max-w-[1100px] mx-auto px-4 md:px-8 py-16">
    <header class="space-y-4 mb-8">
      <h1 class="text-4xl font-bold"><Highlight>{md.data.title}</Highlight></h1>
      <p>{md.data.description}</p>
    </header>
    <MarkdownWrapper>
      <Content />
    </MarkdownWrapper>
  </div>
</MarkdownLayout>
```

---

## 第二部分：社交图标增强 (悬停二维码)

我希望微信图标不进行跳转，而是悬停时显示二维码；邮箱图标悬停时显示具体的邮箱地址。

### 1\. 配置数据

在 `src/config.json` 的 `socials` 数组中，为微信和邮箱添加自定义字段：`qrImage` (二维码图片路径)、`qrText` (提示文字) 或 `qrTextLines` (多行文本)。将不想跳转的 `url` 设为 `"#"`。

```json
{
  "name": "Wechat",
  "icon": "icon-wechat",
  "url": "#",
  "color": "#25b446",
  "qrImage": "/wechat-qr.png",
  "qrText": "扫一扫加微信"
},
{
  "name": "Email",
  "icon": "icon-mail",
  "url": "#",
  "color": "rgb(212, 70, 56)",
  "qrTextLines": ["myemail@qq.com", "work@gmail.com"]
}
```

### 2\. 重写 SocialList 组件

修改 `src/components/SocialList.tsx`，引入 `framer-motion` 实现动画，并添加悬停逻辑。

```tsx
// 部分核心代码逻辑
import { hero } from '@/config.json'
import { motion } from 'framer-motion'

export function SocialList({ className }: { className?: string }) {
  // ... 动画 variants 定义 ...

  return (
    <motion.ul ...>
      {hero.socials.map((social) => {
        const isJustAButton = social.url === '#'

        return (
          <motion.li className="group relative" ...>
            {/* 根据 url 是否为 # 决定渲染 div 还是 a 标签 */}
            {isJustAButton ? (
               <div className="...">...</div>
            ) : (
               <a href={social.url}>...</a>
            )}

            {/* 悬停弹窗逻辑 */}
            {social.qrImage && (
              <div className="hidden group-hover:block absolute ...">
                <img src={social.qrImage} className="w-32" />
                <div>{social.qrText}</div>
              </div>
            )}

            {/* 纯文本弹窗逻辑 */}
            {social.qrTextLines && (
              <div className="hidden group-hover:block absolute ...">
                 {social.qrTextLines.map(line => <p>{line}</p>)}
              </div>
            )}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
```

最后：

```bash
git add .
git commit -m "feat: customize life section and social icons"
git push origin main
```

**done**

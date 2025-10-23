import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    lastMod: z.date().optional(),
    summary: z.string().optional(),
    cover: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    comments: z.boolean().default(true),
    draft: z.boolean().default(false),
    sticky: z.number().default(0),
  }),
})

const projectsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    link: z.string().url(),
  }),
})

const specCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    comments: z.boolean().default(true),
  }),
})

const friendsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    avatar: z.string(),
    link: z.string().url(),
  }),
})

const lifeCollection = defineCollection({
  type: 'content', // 它将读取 Markdown 文件
  schema: z.object({
    title: z.string(),
    description: z.string(), // 用于卡片上的描述
    date: z.date(), // 用于排序
    heroImage: z.string(), // 用于卡片上的图片
  }),
})

export const collections = {
  posts: postsCollection,
  //projects: projectsCollection,
  life: lifeCollection,
  spec: specCollection,
  friends: friendsCollection,
}

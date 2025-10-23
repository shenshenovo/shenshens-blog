// src/components/SocialList.tsx

import { hero } from '@/config.json'
import { clsx } from 'clsx'
import { motion } from 'framer-motion' // <-- 1. 把它“请”回来！

// 2. 这是 Gyoza 原本的动画“蓝图”
const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 交错动画
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
}

// 3. 定义我们 social 对象的“类型”（和上次一样）
interface Social {
  name: string
  icon: string
  url: string
  color: string
  qrImage?: string 
  qrText?: string
}

export function SocialList({ className }: { className?: string }) {
  const socials = hero.socials as Social[]

  return (
    // 4. 使用 Gyoza 原本的 motion.ul，并传入动画“蓝图”
    <motion.ul
      className={clsx(
        'flex gap-4 flex-wrap items-center justify-center lg:justify-start',
        className,
      )}
      variants={listVariants} // <-- 使用 Gyoza 的列表动画
      initial="hidden"
      animate="visible"
    >
      {socials.map((social) => (
        // 5. 使用 Gyoza 原本的 motion.li
        <motion.li
          key={social.name}
          variants={itemVariants} // <-- 使用 Gyoza 的列表项动画
          
          // 6. 【关键合并】把二维码需要的 "group" 和 "relative" 加到 motion.li 上！
          className="group relative"
        >
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={social.name}
            // 7. 这是 Gyoza 原本的 <a> 标签样式
            className="relative size-9 text-white text-xl flex justify-center items-center"
          >
            {/* 8. 这是 Gyoza 原本的图标背景 */}
            <span
              className="absolute inset-0 -z-1 rounded-full group-hover:scale-105 transition"
              style={{ backgroundColor: social.color }}
            ></span>
            
            {/* 9. 这是 Gyoza 原本的图标 */}
            <i className={clsx('iconfont', social.icon)} />
          </a>

          {/* 10. 【关键合并】这是我们上次添加的“二维码弹窗”逻辑
               它现在被完美地包裹在 motion.li 里面
           */}
          {social.qrImage && (
            <div
              className="
                absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-2 bg-white rounded-lg shadow-xl
                border border-gray-200
                
                hidden group-hover:block animate-in fade-in-0 zoom-in-95
                
                dark:bg-zinc-800 dark:border-zinc-700
                w-max
              "
            >
              <img
                src={social.qrImage}
                alt={`${social.name} QR Code`}
                className="w-32 h-32 rounded-md"
              />
              <div className="text-xs text-center ...">
                {social.qrText} {/* <-- 把它换成这个变量！ */}
              </div>
            </div>
          )}
        </motion.li>
      ))}
    </motion.ul>
  )
}
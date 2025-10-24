// src/components/SocialList.tsx

import { hero } from '@/config.json'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

// 动画 "蓝图" (保持不变)
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

// 1. 【更新 Interface】
interface Social {
  name: string
  icon: string
  url: string
  color: string
  qrImage?: string
  qrText?: string
  qrTextLines?: string[] // <-- 把这个新属性加进来
}

export function SocialList({ className }: { className?: string }) {
  const socials = hero.socials as Social[]

  return (
    <motion.ul
      className={clsx(
        'flex gap-4 flex-wrap items-center justify-center lg:justify-start',
        className,
      )}
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {socials.map((social) => {
        const isJustAButton = social.url === '#'

        return (
          <motion.li
            key={social.name}
            variants={itemVariants}
            className="group relative" // "group" 和 "relative" 还在
          >
            {/* 2. <a> vs <div> 的逻辑 (保持不变) */}
            {isJustAButton ? (
              <div
                title={social.name}
                className="relative size-9 text-white text-xl flex justify-center items-center cursor-pointer"
              >
                <span
                  className="absolute inset-0 -z-1 rounded-full group-hover:scale-105 transition"
                  style={{ backgroundColor: social.color }}
                ></span>
                <i className={clsx('iconfont', social.icon)} />
              </div>
            ) : (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="relative size-9 text-white text-xl flex justify-center items-center"
              >
                <span
                  className="absolute inset-0 -z-1 rounded-full group-hover:scale-105 transition"
                  style={{ backgroundColor: social.color }}
                ></span>
                <i className={clsx('iconfont', social.icon)} />
              </a>
            )}

            {/* 3. 【升级弹窗逻辑】 */}

            {/* Check 1: Do we have a QR Image? (Wechat/QQ) */}
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
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                  {social.qrText || '扫一扫'}
                </div>
              </div>
            )}

            {/* Check 2: Do we have Text Lines? (Email) */}
            {social.qrTextLines && (
              <div
                className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-white rounded-lg shadow-xl
                  border border-gray-200
                  hidden group-hover:block animate-in fade-in-0 zoom-in-95
                  dark:bg-zinc-800 dark:border-zinc-700
                  w-max
                "
              >
                {/* 4. 循环数组，为每一行文字创建一个 <p> 标签 */}
                {social.qrTextLines.map((line, index) => (
                  <p 
                    key={index} 
                    className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap"
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}
          </motion.li>
        )
      })}
    </motion.ul>
  )
}
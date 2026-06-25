import { motion, AnimatePresence } from 'framer-motion'
import type { FadeCollapseProps } from './FadeCollapse.types'

export const FadeCollapse = ({
  show,
  children,
  className = '',
  animateHeight = true,
  direction = 'up',
}: Readonly<FadeCollapseProps>) => {
  const yOffset = direction === 'up' ? 10 : direction === 'down' ? -10 : 0

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
            height: animateHeight ? 0 : 'auto',
            y: yOffset,
          }}
          animate={{
            opacity: 1,
            height: 'auto',
            y: 0,
          }}
          exit={{
            opacity: 0,
            height: animateHeight ? 0 : 'auto',
            y: yOffset,
          }}
          transition={{
            opacity: { duration: 0.2 },
            height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }, // easeOutExpo
            y: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          }}
          className={className}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

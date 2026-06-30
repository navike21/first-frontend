import { motion, AnimatePresence } from 'motion/react'
import type { FadeCollapseProps } from './FadeCollapse.types'

const Y_OFFSET: Record<NonNullable<FadeCollapseProps['direction']>, number> = {
  up: 10,
  down: -10,
  none: 0,
}

export const FadeCollapse = ({
  show,
  children,
  className = '',
  animateHeight = true,
  direction = 'up',
}: Readonly<FadeCollapseProps>) => {
  const yOffset = Y_OFFSET[direction]

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

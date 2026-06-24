import { type Transition, type Variants } from 'framer-motion'

/**
 * Standard organic spring transition for modals, cards, and page entries.
 * Decelerates smoothly with a tiny spring response.
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
  mass: 1,
}

/**
 * Snappy spring transition for buttons, toggles, switches, and active states.
 * Fast response, virtually no delay.
 */
export const snappySpringTransition: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.8,
}

/**
 * Playful spring transition with a clear bounce/overshoot.
 * Best for checkboxes, success checkmarks, alert popups.
 */
export const bounceTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 20,
  mass: 0.9,
}

/**
 * Decelerating transition for slide/fade panels.
 */
export const expoTransition: Transition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1], // ease-out-expo
  duration: 0.3,
}

/**
 * Fade in / Fade out animation variants.
 */
export const fadeInOut: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Modal scale and bounce (iOS Pop style) variants.
 */
export const modalSpringVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * Modal bottom slide-up variants.
 */
export const modalSlideUpVariants: Variants = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: 24,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * Modal blur fade variants.
 */
export const modalBlurFadeVariants: Variants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(6px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
}

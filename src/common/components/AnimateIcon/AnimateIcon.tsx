import { useThemeInfo } from '@Hooks/useThemeInfo'
import { Player } from '@lordicon/react'
import { IPlayerOptions } from '@lordicon/react/dist/interfaces'
import { useCallback, useEffect, useRef } from 'react'

interface IAnimateIconProps extends IPlayerOptions {
  loop?: boolean
  toggleAnimation?: boolean
}

export const AnimateIcon = ({
  loop,
  toggleAnimation,
  ...props
}: IAnimateIconProps) => {
  const playerRef = useRef<Player>(null)
  const {
    colors: {
      primary: { contrastText },
    },
  } = useThemeInfo()

  const handleLoopAnimation = useCallback(() => {
    if (loop && !toggleAnimation) {
      playerRef.current?.playFromBeginning()
    }
  }, [loop, toggleAnimation])

  useEffect(() => {
    handleLoopAnimation()

    if (!loop) {
      playerRef.current?.play()
    }
  }, [toggleAnimation, loop, handleLoopAnimation])

  return (
    <div>
      <Player
        {...props}
        ref={playerRef}
        direction={toggleAnimation ? 1 : -1}
        onComplete={handleLoopAnimation}
        colors={`primary:${contrastText},secondary:${contrastText}`}
      />
    </div>
  )
}

// Hook para animações de elementos individuais dentro das páginas
export const useStaggerAnimation = (delay = 0.1) => {
  return {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay
    }
  }
}

// Variações do hook para diferentes tipos de animação
export const useSlideAnimation = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay = 0) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20 }
      case 'down': return { y: -20 }
      case 'left': return { x: 20 }
      case 'right': return { x: -20 }
      default: return { y: 20 }
    }
  }

  return {
    initial: { opacity: 0, ...getInitialPosition() },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay
    }
  }
}

export const useFadeAnimation = (delay = 0) => {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.3,
      delay
    }
  }
}

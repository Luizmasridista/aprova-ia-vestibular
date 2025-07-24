import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface RouteTransitionState {
  isTransitioning: boolean
  previousRoute: string | null
  currentRoute: string
  transitionDirection: 'forward' | 'backward' | 'none'
}

// Mapeamento de rotas para determinar direção da transição
const routeOrder = [
  '/dashboard',
  '/study-plan', 
  '/calendario',
  '/simulados',
  '/perfil'
]

export function useRouteTransition(): RouteTransitionState {
  const location = useLocation()
  const [state, setState] = useState<RouteTransitionState>({
    isTransitioning: false,
    previousRoute: null,
    currentRoute: location.pathname,
    transitionDirection: 'none'
  })

  useEffect(() => {
    const currentIndex = routeOrder.indexOf(location.pathname)
    const previousIndex = state.previousRoute ? routeOrder.indexOf(state.previousRoute) : -1
    
    let direction: 'forward' | 'backward' | 'none' = 'none'
    
    if (previousIndex !== -1 && currentIndex !== -1) {
      direction = currentIndex > previousIndex ? 'forward' : 'backward'
    }

    // Iniciar transição
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      transitionDirection: direction
    }))

    // Finalizar transição após delay
    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        previousRoute: prev.currentRoute,
        currentRoute: location.pathname
      }))
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname, state.previousRoute])

  return state
}

// Hook para animações baseadas na direção da transição
export function useDirectionalAnimation() {
  const { transitionDirection } = useRouteTransition()
  
  const getVariants = () => {
    switch (transitionDirection) {
      case 'forward':
        return {
          initial: { x: 100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -100, opacity: 0 }
        }
      case 'backward':
        return {
          initial: { x: -100, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: 100, opacity: 0 }
        }
      default:
        return {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: -20, opacity: 0 }
        }
    }
  }

  return {
    variants: getVariants(),
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30
    }
  }
}

// Hook para efeitos visuais de transição
export function useTransitionEffects() {
  const { isTransitioning, currentRoute } = useRouteTransition()
  
  // Cores temáticas por rota
  const getRouteTheme = (route: string) => {
    switch (route) {
      case '/dashboard':
        return { primary: '#3b82f6', accent: '#8b5cf6' } // Azul/Roxo
      case '/study-plan':
        return { primary: '#10b981', accent: '#06d6a0' } // Verde
      case '/calendario':
        return { primary: '#f59e0b', accent: '#f97316' } // Laranja
      case '/simulados':
        return { primary: '#ef4444', accent: '#f43f5e' } // Vermelho
      case '/perfil':
        return { primary: '#6366f1', accent: '#8b5cf6' } // Indigo
      default:
        return { primary: '#3b82f6', accent: '#8b5cf6' }
    }
  }

  return {
    isTransitioning,
    theme: getRouteTheme(currentRoute),
    currentRoute
  }
}

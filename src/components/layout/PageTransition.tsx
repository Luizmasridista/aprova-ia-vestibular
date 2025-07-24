import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useDirectionalAnimation, useTransitionEffects } from '@/hooks/useRouteTransition'
import { StaggerContainer } from '@/components/animations/StaggerContainer'

interface PageTransitionProps {
  children: React.ReactNode
}

// Variantes de animação para diferentes tipos de transição
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(4px)'
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    filter: 'blur(4px)'
  }
}

// Transições específicas por rota
const getTransitionConfig = (pathname: string) => {
  const baseTransition = {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8
  }

  // Configurações específicas por seção
  switch (pathname) {
    case '/dashboard':
      return {
        ...baseTransition,
        duration: 0.6,
        delay: 0.1
      }
    case '/study-plan':
      return {
        ...baseTransition,
        duration: 0.7,
        delay: 0.15
      }
    case '/calendario':
      return {
        ...baseTransition,
        duration: 0.5,
        delay: 0.05
      }
    case '/simulados':
      return {
        ...baseTransition,
        duration: 0.6,
        delay: 0.1
      }
    default:
      return baseTransition
  }
}

// Efeito de partículas flutuantes para transições
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-primary/20 rounded-full"
        initial={{
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 10,
          opacity: 0
        }}
        animate={{
          y: -10,
          opacity: [0, 1, 0],
          scale: [0, 1, 0]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          delay: Math.random() * 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    ))}
  </div>
)

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const { variants, transition } = useDirectionalAnimation()
  const { theme, isTransitioning } = useTransitionEffects()

  return (
    <div className="relative min-h-full">
      <FloatingParticles />
      
      {/* Indicador de transição */}
      {isTransitioning && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          className="absolute top-0 left-0 right-0 h-1 z-50"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`
          }}
        />
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transition}
          className="relative z-10"
        >
          {/* Efeito de entrada com gradiente */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Barra de progresso de carregamento */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary origin-left"
            />
            
            {/* Conteúdo da página com animação stagger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="pt-2"
            >
              <StaggerContainer
                staggerDelay={0.08}
                initialDelay={0.1}
                direction="up"
                className="space-y-6"
              >
                {children}
              </StaggerContainer>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Componente para animar cards/elementos individuais
interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ 
        y: -2, 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
